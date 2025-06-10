import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { FuellingRepository } from 'src/repositories/fuelling-repository';
import ListFamilyConsumptionResponse from './dtos/listFamilyConsumption-response';
import { ApiTags } from '@nestjs/swagger';
import { z } from 'zod';

@ApiTags('Fuelling - Report - Family Consumption')
@Controller('fuelling/report/family-consumption')
export default class FamilyConsumptionController {
  constructor(private fuellingRepository: FuellingRepository) {}
  @UseGuards(AuthGuard)
  @Get('/')
  async listFamilyConsumption(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      familyId: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      equipmentId: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      dateFrom: z.coerce
        .string()
        .transform((value) => (value === '' ? null : new Date(value)))
        .optional(),
      dateTo: z.coerce
        .string()
        .transform((value) => (value === '' ? null : new Date(value)))
        .optional(),
    });

    const query = querySchema.parse(req.query);
    // const allFuelling = await this.fuellingRepository.listByEquipmentInBranches(
    //   query && query?.branchId?.length ? query.branchId : user.branches,
    //   query && query?.dateFrom && query?.dateTo
    //     ? { start: query.dateFrom, end: query.dateTo }
    //     : null,
    // );

    const allFuelling = await this.fuellingRepository.listByFilter(
      user.clientId,
      {
        ...(query.familyId &&
          query.familyId.length && {
            equipment: {
              family: {
                ID: {
                  in: query.familyId,
                },
              },
            },
          }),
        ...(query.equipmentId &&
          query.equipmentId.length && {
            equipment: {
              ID: {
                in: query.equipmentId,
              },
            },
          }),
        ...(query.dateFrom &&
          query.dateTo &&
          query.dateFrom !== null &&
          query.dateTo !== null && {
            data_abastecimento: {
              gte: query.dateFrom,
              lte: query.dateTo,
            },
          }),
      },
    );

    const response: ListFamilyConsumptionResponse[] = [];

    const allSumConsumption: {
      equipmentId: number;
      consumption: number;
      quantity: number;
    }[] = [];

    allFuelling.forEach((fuelling) => {
      // Implement your logic here
      const index = response.findIndex(
        (item) => item.family === fuelling.equipment.family.familia,
      );

      if (index >= 0) {
        const findIndexEquipment = response[index].fuelling.findIndex(
          (item) => item.equipmentId === fuelling.equipment.ID,
        );

        if (findIndexEquipment >= 0) {
          const findIndexSumEquipment = allSumConsumption.findIndex(
            (item) => item.equipmentId === fuelling.equipment.ID,
          );

          if (findIndexSumEquipment >= 0) {
            allSumConsumption[findIndexSumEquipment].consumption += Number(
              fuelling.consumo_realizado,
            );
            allSumConsumption[findIndexSumEquipment].quantity++;
          }

          response[index].fuelling[findIndexEquipment].quantity += Number(
            fuelling.quantidade,
          );
          response[index].fuelling[findIndexEquipment].total +=
            Number(fuelling.valorUN) * Number(fuelling.quantidade);
          response[index].fuelling[findIndexEquipment].sumConsumption += Number(
            fuelling.consumo_realizado,
          );
          response[index].fuelling[findIndexEquipment].quantityEquipment++;
          return;
        } else {
          const findIndexSumEquipment = allSumConsumption.findIndex(
            (item) => item.equipmentId === fuelling.equipment.ID,
          );

          if (findIndexSumEquipment >= 0) {
            allSumConsumption[findIndexSumEquipment].consumption += Number(
              fuelling.consumo_realizado,
            );
            allSumConsumption[findIndexSumEquipment].quantity++;
          } else {
            allSumConsumption.push({
              equipmentId: fuelling.equipment.ID,
              consumption: Number(fuelling.consumo_realizado),
              quantity: 1,
            });
          }

          response[index].fuelling.push({
            equipmentId: fuelling.equipment.ID,
            equipment: `${fuelling.equipment.equipamento_codigo}-${fuelling.equipment.descricao}`,
            typeConsumption: fuelling.equipment.tipo_consumo,
            expectedConsumption: Number(fuelling.equipment.consumo_previsto),
            quantity: Number(fuelling.quantidade),
            total: Number(fuelling.valorUN) * Number(fuelling.quantidade),
            consumptionMade: 0,
            sumConsumption: Number(fuelling.consumo_realizado),
            quantityEquipment: 0,
            difference: 0,
          });
        }
      } else {
        allSumConsumption.push({
          equipmentId: fuelling.equipment.ID,
          consumption: Number(fuelling.consumo_realizado),
          quantity: 1,
        });

        response.push({
          family: fuelling.equipment.family.familia,
          fuelling: [
            {
              equipmentId: fuelling.equipment.ID,
              equipment: `${fuelling.equipment.equipamento_codigo}-${fuelling.equipment.descricao}`,
              typeConsumption: fuelling.equipment.tipo_consumo,
              expectedConsumption: Number(fuelling.equipment.consumo_previsto),
              quantity: Number(fuelling.quantidade),
              total: Number(fuelling.valorUN) * Number(fuelling.quantidade),
              consumptionMade: 0,
              sumConsumption: Number(fuelling.consumo_realizado),
              quantityEquipment: 0,
              difference: 0,
            },
          ],
        });
      }
    });

    allSumConsumption.forEach((sum) => {
      response.forEach((item) => {
        item.fuelling.forEach((fuelling) => {
          if (fuelling.equipmentId === sum.equipmentId) {
            fuelling.consumptionMade = Number(
              Number(sum.consumption / sum.quantity).toFixed(2),
            );
            fuelling.quantityEquipment = sum.quantity;

            fuelling.difference =
              fuelling.expectedConsumption / fuelling.consumptionMade;
          }
        });
      });
    });

    return {
      data: response,
    };
  }
}
