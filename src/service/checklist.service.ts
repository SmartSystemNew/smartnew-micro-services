import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cronParser from 'cron-parser';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from 'src/database/prisma.service';
import { CronJob } from 'cron';
import { DateService } from './data.service';
import { ENVService } from './env.service';

@Injectable()
export default class ChecklistService implements OnModuleInit {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private prismaService: PrismaService, // Serviço do Prisma para acessar o banco
    private envService: ENVService,
  ) {}

  private allCronJobActive = {};
  async onModuleInit() {
    if (this.envService.NODE_ENV === 'dev') {
      await this.initializeCronJobs();
    }
  }

  private dateService = new DateService();

  async initializeCronJobs() {
    const cronJobs =
      await this.prismaService.smartnewsystem_checklist_registro_automatico.findMany(
        {
          where: {
            ativo: 1,
          },
        },
      );

    cronJobs.forEach((job) => {
      // Calcula o próximo horário de execução baseado na última execução
      //const now = new Date();
      //const lastExecution = new Date(job.ultimo_registro || job.data_registro);

      const lastExecution = new Date(job.ultimo_registro || job.data_registro);

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
        this.create(job.id); // Executa a tarefa atrasada
        this.updateLastExecution(job.id);

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
          await this.create(job.id);
          await this.updateLastExecution(job.id);
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
    equipmentId: number,
    modelId: number,
  ): Promise<{
    message: string;
    cronJob: 'created' | 'exists';
  }> {
    const equipment =
      await this.prismaService.cadastro_de_equipamentos.findFirst({
        select: {
          ID: true,
          equipamento_codigo: true,
          descricao: true,
          company: {
            select: {
              ID: true,
              razao_social: true,
            },
          },
        },
        where: {
          ID: equipmentId,
        },
      });

    const model =
      await this.prismaService.smartnewsystem_producao_checklist.findFirst({
        include: {
          typePeriodicity: {
            select: {
              id: true,
              descricao: true,
            },
          },
        },
        where: {
          id: modelId,
        },
      });

    if (model.automatico === 1) {
      let cronExpression: string;
      let jobKey: string;
      let hora: string;
      const tipo = model.typePeriodicity.descricao;

      switch (tipo) {
        case 'HORA':
          // Executa a cada 'valor' horas
          // Usa o horário de base definido pelo modelo
          const horaBase = this.dateService.dayjsAddTree(new Date());
          const intervaloHoras = model.periocidade;

          // Define os minutos e a hora de início
          const minutos = horaBase.minute();

          // Cria uma expressão cron que execute a cada 'intervaloHoras' horas nos minutos definidos
          cronExpression = `${minutos} */${intervaloHoras} * * *`;

          //cronExpression = `0 */${model.periocidade} * * *`;
          jobKey = `checklist-${equipment.company.razao_social}-rotina-hora-${model.descricao}-${equipment.equipamento_codigo}-${equipment.descricao}`;
          break;

        case 'DIA':
          // Executa todo dia às 'hora:00'
          hora = this.dateService.dayjsAddTree(model.hora_base).format('HH:mm');

          cronExpression = `${hora.split(':')[1]} ${hora.split(':')[0]} * * *`;
          jobKey = `checklist-${equipment.company.razao_social}-rotina-dia-${model.descricao}-${equipment.equipamento_codigo}-${equipment.descricao}`;
          break;

        case 'SEMANA':
          // Executa toda semana no dia 'diaDaSemana' e horário 'hora:00'
          // O dia da semana vai de 0 (domingo) a 6 (sábado)
          hora = this.dateService.dayjsAddTree(model.hora_base).format('HH:mm');

          cronExpression = `${hora.split(':')[1]} ${hora.split(':')[0]} * * ${
            model.periocidade
          }`;
          jobKey = `checklist-${equipment.company.razao_social}-rotina-semanal-${model.descricao}-${equipment.equipamento_codigo}-${equipment.descricao}`;
          break;

        case 'MES':
          // Executa todo mês no dia 'diaDoMes' e horário 'hora:00'
          hora = this.dateService.dayjsAddTree(model.hora_base).format('HH:mm');

          cronExpression = `${hora.split(':')[1]} ${hora.split(':')[0]} ${
            model.periocidade
          } * *`;
          jobKey = `checklist-${equipment.company.razao_social}-rotina-mensal-${model.descricao}-${equipment.equipamento_codigo}-${equipment.descricao}`;
          break;

        default:
          throw new Error('Tipo de agendamento inválido');
      }

      const validExist =
        await this.prismaService.smartnewsystem_checklist_registro_automatico.findFirst(
          {
            where: {
              id_cliente: equipment.company.ID,
              id_equipamento: equipment.ID,
              id_modelo: modelId,
            },
          },
        );

      if (!validExist) {
        const register =
          await this.prismaService.smartnewsystem_checklist_registro_automatico.create(
            {
              data: {
                id_cliente: equipment.company.ID,
                id_equipamento: equipment.ID,
                id_modelo: modelId,
                chave_rotina: jobKey,
                codigo_rotina: cronExpression,
                data_registro: this.dateService
                  .dayjs(new Date())
                  .subtract(3, 'h')
                  .toDate(),
                ativo: 1,
                ultimo_registro: this.dateService
                  .dayjs(new Date())
                  .subtract(3, 'h')
                  .toDate(),
                log_user: model.log_user,
              },
            },
          );

        const job = new CronJob(cronExpression, async () => {
          await this.create(register.id);
          await this.updateLastExecution(register.id);
        });

        this.allCronJobActive[register.chave_rotina] = job;

        job.start();

        return {
          message: 'Rotina agendada com sucesso',
          cronJob: 'created',
        };
      } else {
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

  async create(registerId: number): Promise<void> {
    const register =
      await this.prismaService.smartnewsystem_checklist_registro_automatico.findUnique(
        {
          select: {
            id: true,
            chave_rotina: true,
            company: {
              select: {
                ID: true,
              },
            },
            equipment: {
              select: {
                ID: true,
              },
            },
            model: {
              select: {
                id: true,
                automatico: true,
                verifica_finalizado: true,
                user: {
                  select: {
                    login: true,
                  },
                },
                checkListItens: {
                  select: {
                    id: true,
                    checkListTask: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
            checklistAutomatic: {
              select: {
                id: true,
                checklist: {
                  select: {
                    id: true,
                    data_hora_encerramento: true,
                  },
                },
              },
            },
          },
          where: { id: registerId },
        },
      );

    if (register.model.automatico === 1) {
      if (
        register.model.verifica_finalizado === 1 &&
        (register.checklistAutomatic.length === 0 ||
          register.checklistAutomatic[register.checklistAutomatic.length - 1]
            .checklist.data_hora_encerramento !== null)
      ) {
        if (register.checklistAutomatic.length > 0) {
          await this.prismaService.smartnewsystem_checklist_automatico.update({
            data: {
              observacao: null,
            },
            where: {
              id: register.checklistAutomatic[
                register.checklistAutomatic.length - 1
              ].id,
            },
          });
        }

        const checklist =
          await this.prismaService.smartnewsystem_checklist.create({
            data: {
              id_cliente: register.company.ID,
              id_equipamento: register.equipment.ID,
              data_hora_inicio: this.dateService
                .dayjsSubTree(new Date())
                .toDate(),
              login: register.model?.user?.login,
              checklistXModel: {
                create: {
                  id_modelo: register.model.id,
                },
              },
              checkListPeriod: {
                createMany: {
                  data: register.model.checkListItens.map((item) => ({
                    id_item_checklist: item.id,
                  })),
                },
              },
              checklistAutomatic: {
                create: {
                  id_cliente: register.company.ID,
                  id_registro_automatico: register.id,
                  log_date: this.dateService.dayjsSubTree(new Date()).toDate(),
                },
              },
              log_date: this.dateService.dayjsSubTree(new Date()).toDate(),
            },
          });

        await this.prismaService.log_smartnewsystem_checklist_automatico.create(
          {
            data: {
              id_cliente: register.company.ID,
              id_registro_automatico: register.id,
              id_checklist: checklist.id,
              log_date: this.dateService.dayjsSubTree(new Date()).toDate(),
              observacao: `Checklist nº ${
                checklist.id
              } criado, executado as : ${this.dateService
                .dayjs(new Date())
                .format('D/M/YYYY HH:mm:ss')}`,
            },
          },
        );
      } else if (register.model.verifica_finalizado === 0) {
        await this.prismaService.smartnewsystem_checklist.create({
          data: {
            id_cliente: register.company.ID,
            id_equipamento: register.equipment.ID,
            data_hora_inicio: this.dateService
              .dayjsSubTree(new Date())
              .toDate(),
            login: register.model?.user?.login,
            checklistXModel: {
              create: {
                id_modelo: register.model.id,
              },
            },
            checkListPeriod: {
              createMany: {
                data: register.model.checkListItens.map((item) => ({
                  id_item_checklist: item.id,
                })),
              },
            },
            checklistAutomatic: {
              create: {
                id_cliente: register.company.ID,
                id_registro_automatico: register.id,
                log_date: this.dateService.dayjsSubTree(new Date()).toDate(),
              },
            },
            log_date: this.dateService.dayjsSubTree(new Date()).toDate(),
          },
        });
      } else if (register.model.verifica_finalizado === 1) {
        await this.prismaService.smartnewsystem_checklist_automatico.update({
          data: {
            observacao:
              'Não foi possível executar checklist, pois a checklist anterior não foi finalizado, executado as : ' +
              this.dateService.dayjs(new Date()).format('D/M/YYYY HH:mm:ss'),
          },
          where: {
            id: register.checklistAutomatic[
              register.checklistAutomatic.length - 1
            ].id,
          },
        });

        await this.prismaService.log_smartnewsystem_checklist_automatico.create(
          {
            data: {
              id_cliente: register.company.ID,
              id_registro_automatico: register.id,
              id_checklist:
                register.checklistAutomatic[
                  register.checklistAutomatic.length - 1
                ].checklist.id,
              log_date: this.dateService.dayjsSubTree(new Date()).toDate(),
              observacao: `Não foi possível executar criação do checklist programado, existe checklist nº ${
                register.checklistAutomatic[
                  register.checklistAutomatic.length - 1
                ].checklist.id
              } que ainda não foi finalizado, impedindo de criar novos checklist, executado as : ${this.dateService
                .dayjs(new Date())
                .format('D/M/YYYY HH:mm:ss')}`,
            },
          },
        );
      }
    } else {
      await this.prismaService.smartnewsystem_checklist_registro_automatico.update(
        {
          data: {
            ativo: 0,
          },
          where: {
            id: register.id,
          },
        },
      );

      // const job = this.allCronJobActive[register.chave_rotina];

      const job = this.schedulerRegistry.getCronJob(
        `${register.id}-${register.chave_rotina}`,
      );

      job.stop();
    }
  }

  // Método para atualizar a última execução do job no banco
  async updateLastExecution(id: number) {
    //console.log(this.dateService.dayjs(new Date()).subtract(3, 'h').toDate());
    await this.prismaService.smartnewsystem_checklist_registro_automatico.update(
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

  listCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      console.log(value);

      console.log(`Cron job ${key} está ativo`);
    });
  }

  async stopCronJobForModel(modelId: number) {
    const allRegister =
      await this.prismaService.smartnewsystem_checklist_registro_automatico.findMany(
        {
          where: {
            id_modelo: modelId,
          },
        },
      );

    for await (const register of allRegister) {
      await this.prismaService.smartnewsystem_checklist_registro_automatico.update(
        {
          data: {
            ativo: 0,
          },
          where: {
            id: register.id,
          },
        },
      );

      try {
        const job = this.schedulerRegistry.getCronJob(
          `${register.id}-${register.chave_rotina}`,
        );

        if (job) {
          job.stop();
        }
      } catch (error) {
        //console.error(error);
      }
    }
  }

  async startCronJobForModel(modelId: number) {
    const allRegister =
      await this.prismaService.smartnewsystem_checklist_registro_automatico.findMany(
        {
          where: {
            id_modelo: modelId,
          },
        },
      );

    for await (const register of allRegister) {
      await this.prismaService.smartnewsystem_checklist_registro_automatico.update(
        {
          data: {
            ativo: 1,
          },
          where: {
            id: register.id,
          },
        },
      );

      try {
        const job = this.schedulerRegistry.getCronJob(
          `${register.id}-${register.chave_rotina}`,
        );

        job.start();
      } catch (error) {
        const newJob = new CronJob(register.codigo_rotina, async () => {
          await this.create(register.id);
          await this.updateLastExecution(register.id);
        });

        this.schedulerRegistry.addCronJob(
          `${register.id}-${register.chave_rotina}`,
          newJob,
        );

        this.allCronJobActive[register.chave_rotina] = newJob;

        newJob.start();
      }
    }
  }
}
