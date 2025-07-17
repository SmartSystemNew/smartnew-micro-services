import { SchedulerRegistry } from '@nestjs/schedule';
import { ENVService } from './env.service';
import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CronJob } from 'cron';
import * as cronParser from 'cron-parser';
import { DateService } from './data.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export default class DescriptionPlanningService
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    //private prismaService: PrismaService, // Serviço do Prisma para acessar o banco
    private envService: ENVService,
    private dateService: DateService,
  ) {}

  private allCronJobActive = {};

  private smartPrisma = new PrismaClient({
    datasourceUrl: this.envService.DATABASE_URL,
    log: ['query', 'warn', 'info', 'error'],
  });

  private sofmanPrisma = new PrismaClient({
    datasourceUrl: this.envService.SOFMAN_SMART_URL,
    log: ['query', 'warn', 'info', 'error'],
  });

  async onModuleInit() {
    if (this.envService.NODE_ENV === 'services') {
      console.log('CronJobs da smart');
      await this.initializeCronJobs(this.smartPrisma);

      console.log('CronJobs da sofman');
      await this.initializeCronJobs(this.sofmanPrisma);
    }
  }

  async onModuleDestroy() {
    this.smartPrisma.$disconnect();
    this.sofmanPrisma.$disconnect();
  }

  async initializeCronJobs(prisma: PrismaClient) {
    console.log('CronJobs inicializados');
    const cronJobs =
      await prisma.smartnewsystem_manutencao_registro_planejamento_automatico.findMany(
        {
          where: {
            ativo: 1,
          },
        },
      );

    cronJobs.forEach((job) => {
      // Calcula o próximo horário de execução baseado na última execução

      const lastExecution = new Date(job.ultimo_registro || job.data_inicio);

      let nextExecution = this.calculateNextExecution(
        job.codigo_rotina,
        lastExecution,
      );

      let existingJob;

      try {
        // Tenta buscar o cron job registrado
        existingJob = this.schedulerRegistry.getCronJob(
          `${job.id}-${job.chave_rotina}`,
        );
      } catch (error) {
        // Se não encontrar, o catch irá capturar e continuar
        console.log(
          `Cron job ${job.id}-${job.chave_rotina} não encontrado. Será criado.`,
        );
      }

      const now = this.dateService.dayjsSubTree(new Date()).toDate();

      console.log('nextExecution => ', nextExecution);

      if (nextExecution < now) {
        // Se o próximo horário de execução já passou, execute imediatamente

        console.log(
          `Rotina ${job.chave_rotina} deveria ter sido executada em ${nextExecution}. Executando agora.`,
        );
        this.create(prisma, job.id); // Executa a tarefa atrasada
        this.updateLastExecution(prisma, job.id);

        // Recalcular o próximo horário de execução futuro

        nextExecution = this.calculateNextExecution(
          job.codigo_rotina,
          lastExecution,
        );

        console.log(`Próxima execução recalculada para: ${nextExecution}`);
      }

      if (!existingJob) {
        //Agendar o job para iniciar no próximo horário correto
        const cronJob = new CronJob(job.codigo_rotina, async () => {
          console.log(`Rotina ${job.chave_rotina} Iniciada`);
          await this.create(prisma, job.id);
          await this.updateLastExecution(prisma, job.id);
          console.log(`Rotina ${job.chave_rotina} finalizada`);
        });

        this.schedulerRegistry.addCronJob(
          `${job.id}-${job.chave_rotina}`,
          cronJob,
        );

        cronJob.start();
      }
    });

    console.log(
      `${cronJobs.length} cron jobs foram reativados na inicialização.`,
    );
  }

  // Cria método Job
  async createJob(
    bankId: number,
    taskPlanningId: number,
  ): Promise<{
    message: string;
    cronJob: 'created' | 'exists' | 'notCreated';
  }> {
    let prisma = this.smartPrisma;

    if (bankId === 2) {
      prisma = this.sofmanPrisma;
    }

    const taskPlanning =
      await prisma.sofman_tarefas_planejamento_manutencao.findFirst({
        select: {
          id: true,
          periodicidade_uso: true,
          data_base: true,
          log_user: true,
          data_inicio: true,
          descriptionPlanMaintenance: {
            select: {
              id: true,
              processamento: true,
              descricao: true,
              company: {
                select: {
                  ID: true,
                  razao_social: true,
                },
              },
              family: {
                select: {
                  ID: true,
                  familia: true,
                },
              },
              branch: {
                select: {
                  ID: true,
                },
              },
            },
          },
          periodicity: {
            select: {
              id: true,
              descricao: true,
            },
          },
        },
        where: {
          id: taskPlanningId,
        },
      });

    if (
      taskPlanning.descriptionPlanMaintenance.processamento === 'automatico'
    ) {
      let cronExpression: string;
      let jobKey: string;
      let hora: string;
      const tipo = taskPlanning?.periodicity?.descricao;
      const { descriptionPlanMaintenance } = taskPlanning;
      if (tipo === null) {
        throw new NotFoundException('Tipo de periodicidade não encontrado');
      }

      console.log(tipo);

      switch (tipo) {
        case 'HORA':
          // Executa a cada 'valor' horas
          // Usa o horário de base definido pelo modelo
          const horaBase = this.dateService.dayjsAddTree(new Date());
          const intervaloHoras = taskPlanning.periodicidade_uso;

          // Define os minutos e a hora de início
          const minutos = horaBase.minute();

          // Cria uma expressão cron que execute a cada 'intervaloHoras' horas nos minutos definidos
          cronExpression = `${minutos} */${intervaloHoras} * * *`;

          //cronExpression = `0 */${model.periocidade} * * *`;
          jobKey = `planejamento-${descriptionPlanMaintenance.company.razao_social}-rotina-hora-${descriptionPlanMaintenance.family.familia}-${descriptionPlanMaintenance.descricao}`;
          break;

        case 'DIA':
          // Executa todo dia às 'hora:00'
          hora = this.dateService
            .dayjsAddTree(taskPlanning.data_base)
            .format('HH:mm');

          cronExpression = `${hora.split(':')[1]} ${hora.split(':')[0]} * * *`;
          jobKey = `planejamento-${descriptionPlanMaintenance.company.razao_social}-rotina-dia-${descriptionPlanMaintenance.family.familia}-${descriptionPlanMaintenance.descricao}`;
          break;

        case 'SEMANA':
          // Executa toda semana no dia 'diaDaSemana' e horário 'hora:00'
          // O dia da semana vai de 0 (domingo) a 6 (sábado)
          hora = this.dateService
            .dayjsAddTree(taskPlanning.data_base)
            .format('HH:mm');

          cronExpression = `${hora.split(':')[1]} ${hora.split(':')[0]} * * ${
            taskPlanning.periodicidade_uso
          }`;
          jobKey = `planejamento-${descriptionPlanMaintenance.company.razao_social}-rotina-semanal-${descriptionPlanMaintenance.family.familia}-${descriptionPlanMaintenance.descricao}`;
          break;

        case 'MES':
          // Executa todo mês no dia 'diaDoMes' e horário 'hora:00'
          hora = this.dateService
            .dayjsAddTree(taskPlanning.data_base)
            .format('HH:mm');

          cronExpression = `${hora.split(':')[1]} ${hora.split(':')[0]} ${
            taskPlanning.periodicidade_uso
          } * *`;
          jobKey = `planejamento-${descriptionPlanMaintenance.company.razao_social}-rotina-mensal-${descriptionPlanMaintenance.family.familia}-${descriptionPlanMaintenance.descricao}`;
          break;

        default:
          throw new Error('Tipo de agendamento inválido');
      }

      const validExist =
        await prisma.smartnewsystem_manutencao_registro_planejamento_automatico.findFirst(
          {
            where: {
              id_cliente: descriptionPlanMaintenance.company.ID,
              id_tarefa_planejamento: taskPlanning.id,
            },
          },
        );

      if (!validExist) {
        const register =
          await prisma.smartnewsystem_manutencao_registro_planejamento_automatico.create(
            {
              data: {
                id_cliente: descriptionPlanMaintenance.company.ID,
                id_tarefa_planejamento: taskPlanning.id,
                gerar_finalizado: 1,
                id_filial: descriptionPlanMaintenance.branch.ID,
                chave_rotina: jobKey,
                codigo_rotina: cronExpression,
                data_inicio: this.dateService
                  .dayjs(taskPlanning?.data_inicio || new Date())
                  .subtract(3, 'h')
                  .toDate(),
                ativo: 1,
                ultimo_registro: this.dateService
                  .dayjs(taskPlanning?.data_inicio || new Date())
                  .subtract(3, 'h')
                  .toDate(),
                log_user: taskPlanning.log_user,
              },
            },
          );

        const job = new CronJob(cronExpression, async () => {
          await this.create(prisma, register.id);
          await this.updateLastExecution(prisma, register.id);
        });

        this.allCronJobActive[register.chave_rotina] = job;

        job.start();

        return {
          message: 'Rotina agendada com sucesso',
          cronJob: 'created',
        };
      } else {
        // Busca o CronJob existente
        let existingJob;
        try {
          existingJob = this.schedulerRegistry.getCronJob(
            `${validExist.id}-${validExist.chave_rotina}`,
          );
        } catch (error) {
          console.log(
            `CronJob ${validExist.id}-${validExist.chave_rotina} não encontrado.`,
          );
        }

        // Para e deleta o CronJob existente, se houver
        if (existingJob) {
          existingJob.stop();
          this.schedulerRegistry.deleteCronJob(
            `${validExist.id}-${validExist.chave_rotina}`,
          );
          console.log(
            `CronJob ${validExist.id}-${validExist.chave_rotina} removido.`,
          );
        }

        let cronExpression: string;
        let jobKey: string;
        let hora: string;
        const tipo = taskPlanning?.periodicity?.descricao;
        const { descriptionPlanMaintenance } = taskPlanning;
        if (tipo === null) {
          throw new NotFoundException('Tipo de periodicidade não encontrado');
        }

        console.log(tipo);

        switch (tipo) {
          case 'HORA':
            // Executa a cada 'valor' horas
            // Usa o horário de base definido pelo modelo
            const horaBase = this.dateService.dayjsAddTree(new Date());
            const intervaloHoras = taskPlanning.periodicidade_uso;

            // Define os minutos e a hora de início
            const minutos = horaBase.minute();

            // Cria uma expressão cron que execute a cada 'intervaloHoras' horas nos minutos definidos
            cronExpression = `${minutos} */${intervaloHoras} * * *`;

            //cronExpression = `0 */${model.periocidade} * * *`;
            jobKey = `planejamento-${descriptionPlanMaintenance.company.razao_social}-rotina-hora-${descriptionPlanMaintenance.family.familia}-${descriptionPlanMaintenance.descricao}`;
            break;

          case 'DIA':
            // Executa todo dia às 'hora:00'
            hora = this.dateService
              .dayjsAddTree(taskPlanning.data_base)
              .format('HH:mm');

            cronExpression = `${hora.split(':')[1]} ${
              hora.split(':')[0]
            } * * *`;
            jobKey = `planejamento-${descriptionPlanMaintenance.company.razao_social}-rotina-dia-${descriptionPlanMaintenance.family.familia}-${descriptionPlanMaintenance.descricao}`;
            break;

          case 'SEMANA':
            // Executa toda semana no dia 'diaDaSemana' e horário 'hora:00'
            // O dia da semana vai de 0 (domingo) a 6 (sábado)
            hora = this.dateService
              .dayjsAddTree(taskPlanning.data_base)
              .format('HH:mm');

            cronExpression = `${hora.split(':')[1]} ${hora.split(':')[0]} * * ${
              taskPlanning.periodicidade_uso
            }`;
            jobKey = `planejamento-${descriptionPlanMaintenance.company.razao_social}-rotina-semanal-${descriptionPlanMaintenance.family.familia}-${descriptionPlanMaintenance.descricao}`;
            break;

          case 'MES':
            // Executa todo mês no dia 'diaDoMes' e horário 'hora:00'
            hora = this.dateService
              .dayjsAddTree(taskPlanning.data_base)
              .format('HH:mm');

            cronExpression = `${hora.split(':')[1]} ${hora.split(':')[0]} ${
              taskPlanning.periodicidade_uso
            } * *`;
            jobKey = `planejamento-${descriptionPlanMaintenance.company.razao_social}-rotina-mensal-${descriptionPlanMaintenance.family.familia}-${descriptionPlanMaintenance.descricao}`;
            break;

          default:
            throw new Error('Tipo de agendamento inválido');
        }

        await prisma.smartnewsystem_manutencao_registro_planejamento_automatico.update(
          {
            data: {
              chave_rotina: jobKey,
              codigo_rotina: cronExpression,
              data_inicio: this.dateService
                .dayjs(taskPlanning?.data_inicio || new Date())
                .subtract(3, 'h')
                .toDate(),
              ativo: 1,
              ultimo_registro: this.dateService
                .dayjs(taskPlanning?.data_inicio || new Date())
                .subtract(3, 'h')
                .toDate(),
            },
            where: { id: validExist.id },
          },
        );

        // Cria um novo CronJob com a nova expressão
        const newCronJob = new CronJob(cronExpression, async () => {
          if (
            this.dateService.dayjsSubTree(new Date()).toDate() >=
              taskPlanning.data_inicio ||
            new Date()
          ) {
            console.log(`Rotina ${jobKey} iniciada`);
            await this.create(prisma, taskPlanning.id);
            await this.updateLastExecution(prisma, taskPlanning.id);
          }
        });

        // Registra o novo CronJob
        this.schedulerRegistry.addCronJob(
          `${validExist.id}-${jobKey}`,
          newCronJob,
        );
        this.allCronJobActive[jobKey] = newCronJob;
        newCronJob.start();

        // Atualiza a expressão no banco
        await prisma.smartnewsystem_manutencao_registro_planejamento_automatico.update(
          {
            where: { id: validExist.id },
            data: { codigo_rotina: cronExpression },
          },
        );

        // const job = new CronJob(cronExpression, async () => {
        //   await this.create(validExist.id);
        //   await this.updateLastExecution(validExist.id);
        // });
        // job.start();
        return {
          message: 'Rotina já existe',
          cronJob: 'exists',
        };
      }
    }

    return {
      message: 'Rotina não criada!',
      cronJob: 'notCreated',
    };
  }

  async create(prisma: PrismaClient, registerId: number): Promise<void> {
    const register =
      await prisma.smartnewsystem_manutencao_registro_planejamento_automatico.findFirst(
        {
          select: {
            id: true,
            id_cliente: true,
            id_filial: true,
            chave_rotina: true,
            gerar_finalizado: true,
            taskPlanning: {
              select: {
                id: true,
                log_user: true,
                id_componente: true,
                descriptionPlanMaintenance: {
                  select: {
                    id: true,
                    id_setor_executante: true,
                    id_tipo_manutencao: true,
                    descricao: true,
                    equipment: {
                      select: {
                        ID: true,
                      },
                    },
                    planningEquipment: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
                task: {
                  select: {
                    id: true,
                    tarefa: true,
                  },
                },
              },
            },
          },
          where: { id: registerId },
        },
      );
    //const now = this.dateService.dayjsSubTree(new Date()).toDate();

    const equipmentFind = await prisma.cadastro_de_equipamentos.findFirst({
      select: {
        ID: true,
        ID_filial: true,
      },
      where: {
        ID: register.taskPlanning.descriptionPlanMaintenance.equipment.ID,
      },
    });

    // const registerAutomatic =
    //   await prisma.smartnewsystem_manutencao_planejamento_automatico.findFirst({
    //     where: {
    //       id_cliente: register.id_cliente,
    //       id_registro_automatico: register.id,
    //       id_equipamento: equipmentFind.ID,
    //     },
    //   });

    // if (register.gerar_finalizado === 1 && registerAutomatic) {
    //   const orderServiceOld =
    //     await prisma.controle_de_ordens_de_servico.findFirst({
    //       where: {
    //         planningAutomatic: {
    //           some: {
    //             id: registerAutomatic.id,
    //           },
    //         },
    //       },
    //     });
    //   if (orderServiceOld && orderServiceOld.data_hora_encerramento === null) {
    //     await prisma.smartnewsystem_manutencao_planejamento_automatico.create({
    //       data: {
    //         id_ordem_servico: orderServiceOld.ID,
    //         id_registro_automatico: register.id,
    //         id_cliente: orderServiceOld.ID_cliente,
    //         id_equipamento: equipmentFind.ID,
    //         observacao: `Ordem de Serviço não lançada pois anterior ${orderServiceOld.ID} ainda nao foi finalizada!`,
    //       },
    //     });
    //   }
    // }
    // const orderService = await prisma.controle_de_ordens_de_servico.create({
    //   data: {
    //     ID_cliente: register.id_cliente,
    //     ID_filial: equipmentFind.ID_filial,
    //     ID_setor:
    //       register.taskPlanning.descriptionPlanMaintenance.id_setor_executante,
    //     id_equipamento: equipmentFind.ID,
    //     data_hora_solicitacao: now,
    //     log_user: register.taskPlanning.log_user,
    //     observacoes: `Criado automaticamente do Plano: ${register.taskPlanning.descriptionPlanMaintenance.descricao}`,
    //     taskServiceOrder: {
    //       create: {
    //         id_cliente: register.id_cliente,
    //         id_filial: equipmentFind.ID_filial,
    //         id_componente: register.taskPlanning.id_componente,
    //         tarefa: register.taskPlanning.task.id,
    //       },
    //     },
    //   },
    // });
    const calculePlan = await prisma.sofman_calcula_planos.findMany({
      where: {
        id_cliente: register.id_cliente,
      },
    });

    if (calculePlan.length > 0 && calculePlan[0].calcula === 1) {
      try {
        const sqlExec: string[] = await prisma.$queryRaw`
          select proc from sofman_view_processa_pcm
				  WHERE id_filial IN(
            SELECT id_filial FROM sofman_filiais_x_usuarios
									WHERE id = ${equipmentFind.ID_filial} )
				order by programacaoid;`;

        for (const sql of sqlExec) {
          await prisma.$executeRawUnsafe(sql);
        }
      } catch (error) {
        console.error('Erro ao executar SQL:', error);
        const valid = {
          calculePlan: calculePlan[0],
          equipmentFind,
          ...error,
        };
        await prisma.smartnewsystem_log_erro_banco.create({
          data: {
            dados: valid,
          },
        });
      }

      await prisma.smartnewsystem_manutencao_planejamento_automatico.create({
        data: {
          //id_ordem_servico: orderService.ID,
          //id_ordem_servico: 1,
          id_registro_automatico: register.id,
          id_cliente: register.id_cliente,
          id_equipamento: equipmentFind.ID,
          //observacao: `Ordem de Serviço ${orderService.ID} criada automaticamente`,
        },
      });
    }
    //console.log(`Ordem de Serviço ${orderService.ID} criada.`);
  }

  // Método para calcular o próximo horário de execução
  calculateNextExecution(cronExpression: string, referenceDate: Date): Date {
    const interval = cronParser.parseExpression(cronExpression, {
      currentDate: referenceDate,
    });
    const nextExecution = interval.next().toDate(); // Pega o próximo horário futuro

    return nextExecution;
    //return this.dateService.dayjsSubTree(nextExecution).toDate();
  }

  // Método para atualizar a última execução do job no banco
  async updateLastExecution(prisma: PrismaClient, id: number) {
    //console.log(this.dateService.dayjs(new Date()).subtract(3, 'h').toDate());
    await prisma.smartnewsystem_manutencao_registro_planejamento_automatico.update(
      {
        where: { id },
        data: {
          ultimo_registro: this.dateService
            .dayjs(new Date())
            .subtract(3, 'h')
            .toDate(),
        },
      },
    );
  }
}
