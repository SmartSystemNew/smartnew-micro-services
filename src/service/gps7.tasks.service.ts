import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import fetch from 'node-fetch';
import { PrismaService } from 'src/database/prisma.service';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { LogOperationRepository } from 'src/repositories/log-operation-repository';
import { GPS7Response } from 'src/types/gps7';
import { DateService } from './data.service';
import { ENVService } from './env.service';

type DataSet = {
  id_filial: number;
  id_equipamento: number;
  data_leitura: string;
  valor_real: number;
  unidade_medida: number;
  observacoes: string;
};
@Injectable()
export class Gps7ImportEquipmentTask {
  private readonly logger = new Logger(Gps7ImportEquipmentTask.name);
  constructor(
    private equipmentRepository: EquipmentRepository,
    private logOperationRepository: LogOperationRepository,
    private dateService: DateService,
    private prisma: PrismaService,
    private env: ENVService,
  ) {}

  async genData(data: GPS7Response): Promise<DataSet[]> {
    const idClient = 70;
    const codeUsed = [];
    const dataArray = [];

    const dataResponse = data.msg;
    if (Array.isArray(dataResponse)) {
      for await (const item of dataResponse) {
        if (codeUsed.includes(item.identificador)) continue;
        codeUsed.push(item.identificador);
        const equipments =
          await this.equipmentRepository.getDataUnitMetricFromPlan(
            idClient,
            item.identificador,
          );
        if (equipments && equipments.length > 0) {
          for await (const equipment of equipments) {
            const unitType = equipment.unitType;

            let valueCurrent: number;
            if (unitType.toLocaleLowerCase() === 'hora') {
              valueCurrent = item.horimetro;
            }
            if (unitType.toLocaleLowerCase() === 'km') {
              valueCurrent = item.hodometro;
            }

            const data = {
              id_filial: equipment.idBranch,
              id_equipamento: equipment.id,
              data_leitura: this.dateService.dayjsSubTree(item.data).toDate(),
              valor_real: valueCurrent,
              unidade_medida: equipment.idUnitMetric,
              observacoes: `Api GPS7 ID: ${item.id}`,
            };

            const querySet =
              await this.prisma.sofman_log_funcionamento.findMany({
                take: 1,
                orderBy: [
                  {
                    id_equipamento: 'desc',
                  },
                  {
                    valor_real: 'desc',
                  },
                ],
                where: {
                  id_equipamento: equipment.id,
                  valor_real: {
                    gte: valueCurrent,
                  },
                },
              });
            if (querySet.length > 0) continue;
            dataArray.push(data);
          }
        }
      }
    }
    return dataArray;
  }

  @Cron('0 0 5,12 * * *', { timeZone: 'America/Sao_Paulo' })
  async import() {
    const nodes_permission = ['production'];
    if (!!!nodes_permission.includes(this.env.NODE_ENV)) return;
    try {
      const login = 'SMARTNEW';
      const password = '1234';
      const response = await fetch(
        `http://www.gps7.com.br/gps7/api/api.php?action=posicoes&usuario=${login}&senha=${password}`,
      );
      const result = await response.json();

      const dateCheck = new Date();
      const querySetCheck = await this.prisma.sofman_log_funcionamento.findMany(
        {
          where: {
            log_date: {
              gte: this.dateService.dayjsSubTree(dateCheck).toDate(),
            },
            observacoes: {
              contains: 'Api GPS7 ID:',
            },
          },
        },
      );

      if (querySetCheck.length >= 5) {
        this.logger.log('Importação já realizada hoje.');
        return;
      }

      const data = await this.genData(result);
      const uniqueData: DataSet[] = [];
      for await (const item of data) {
        const exists = uniqueData.some(
          (dataItem) =>
            dataItem.id_equipamento === item.id_equipamento &&
            dataItem.data_leitura === item.data_leitura &&
            dataItem.valor_real === item.valor_real &&
            dataItem.unidade_medida === item.unidade_medida &&
            dataItem.observacoes === item.observacoes,
        );
        if (!exists) {
          uniqueData.push(item);
        }
      }

      try {
        await this.logOperationRepository.createMany(uniqueData);
      } catch (error: any) {
        console.log(error);
        throw error; // Throw the modified error
      }
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
