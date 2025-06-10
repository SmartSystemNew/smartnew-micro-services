import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import MaterialRepository from 'src/repositories/material-repository';
import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
import { DateService } from 'src/service/data.service';
import { z } from 'zod';

@ApiTags('Buy - Report')
@Controller('/buy/report')
export default class ReportBuyController {
  constructor(
    private materialRepository: MaterialRepository,
    private dateService: DateService,
    private stockInventoryRepository: StockInventoryRepository,
    private materialServiceOrderRepository: MaterialServiceOrderRepository,
    private materialCodeRepository: MaterialCodeRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/stock')
  async stockReport(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      startDate: z.coerce
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      endDate: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      index: z.coerce.number().default(0),
      perPage: z.coerce.number().default(10),
      material: z.coerce.number().optional(),
      code: z.coerce.string().optional(),
      industry: z.coerce.string().optional(),
      specification: z.coerce.string().optional(),
      classification: z.array(z.coerce.number()).optional(),
      unity: z.coerce.string().optional(),
    });

    const query = querySchema.parse(req.query);
    const filter = [];

    if (query.code) {
      filter.push(`and smc.codigo like '%${query.code}%' `);
    }

    if (query.industry) {
      filter.push(`and smc.marca like '%${query.industry}%'`);
    }

    if (query.specification) {
      filter.push(`and smc.especificacao like '%${query.specification}%'`);
    }

    if (query.classification && query.classification.length > 0) {
      const classificationJoin = query.classification.join(',');
      filter.push(`and smc.classificacao in ('${classificationJoin}')`);
    }

    if (query.unity) {
      filter.push(`and scm.unidade like '%${query.unity}%'`);
    }

    const materials = await this.materialRepository.listStockCodeSecondInPage(
      user.clientId,
      query.index,
      query.perPage,
      query.startDate,
      query.endDate,
      query.material ? [query.material] : null,
      filter.length > 0 ? filter.join('') : null,
    );

    const totalMaterial =
      await this.materialRepository.countListStockCodeSecond(
        user.clientId,
        query.startDate,
        query.endDate,
        query.material ? [query.material] : null,
        filter.length > 0 ? filter.join('') : null,
      );

    const classification = {
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada',
    };

    const response = materials.map((material) => {
      return {
        id: material.id,
        code: material.codigo,
        industry: material.marca,
        classification: classification[material.classificacao],
        specification: material.especificacao,
        material: material.material,
        unity: material.unidade,
        category: material.descricao,
        inCome: material.entrada,
        outCome: material.saida,
        total: material.entrada - material.saida - material.reserva,
        valueIn: material.ultima_entrada,
        valueOut: material.ultima_saida,
        max: material.estoque_max,
        min: material.estoque_min,
      };
    });

    return {
      rows: response,
      pageCount: Math.ceil(totalMaterial / query.perPage),
      totalItens: totalMaterial,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/stock-buy')
  async stockBuyReport(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      startDate: z.coerce
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      endDate: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      material: z.coerce.number().optional(),
    });

    const query = querySchema.parse(req.query);

    const allStock = [];

    const finalDate = query.endDate ? new Date(query.endDate) : new Date();

    const currentDate = new Date(query.startDate);

    const allStockIn =
      await this.stockInventoryRepository.sumGroupMaterialSecondaryByBeforeDate(
        user.clientId,
        currentDate,
        query.material ? [query.material] : null,
      );

    const allStockOut =
      await this.materialServiceOrderRepository.sumGroupByMaterialSecondary(
        user.clientId,
        currentDate,
        query.material ? [query.material] : null,
      );

    while (currentDate <= finalDate) {
      const material =
        await this.materialCodeRepository.listForReportStockByClient(
          user.clientId,
          null,
          null,
          currentDate,
          {
            ...(query.material && {
              id: query.material,
            }),
            OR: [
              {
                stockIn: {
                  some: {
                    stock: {
                      data_entrada: currentDate,
                    },
                    quantidade: {
                      gt: 0,
                    },
                  },
                },
              },
              {
                materialServiceOrder: {
                  some: {
                    data_uso: currentDate,
                    quantidade: {
                      gt: 0,
                    },
                  },
                },
              },
            ],
          },
        );

      const classification = {
        '1': 'Original',
        '2': 'Genuína',
        '3': 'Genérica',
        '4': 'Paralela',
        '5': 'Recondicionada',
      };

      material.forEach((item) => {
        //console.log(item);
        const allStockFilter = allStock.filter(
          (value) => value.materialId === item.id,
          // &&            value.currentDate ===
          //     this.dateService
          //       .dayjs(currentDate)
          //       .add(3, 'h')
          //       .format('YYYY-MM-DD'),
        );

        let previousBalance = 0;

        if (allStockFilter.length > 0) {
          previousBalance =
            allStockFilter[allStockFilter.length - 1].accumulatedBalance;
        } else {
          previousBalance =
            Number(
              allStockIn.find((value) => value.id_codigo === item.id)
                ?.quantity || 0,
            ) -
            Number(
              allStockOut.find((value) => value.id_codigo === item.id)
                ?.quantity || 0,
            );
        }

        const inCome = item.stockIn.reduce(
          (acc, stock) => acc + Number(stock.quantidade),
          0,
        );

        const outCome = item.materialServiceOrder.reduce(
          (acc, stock) => acc + Number(stock.quantidade),
          0,
        );

        allStock.push({
          currentDate: this.dateService
            .dayjs(currentDate)
            .add(3, 'h')
            .format('YYYY-MM-DD'),
          materialId: item.material.id,
          codeId: item.id,
          code: item.codigo,
          brand: item.marca,
          specification: item.especificacao,
          classification: item.classificacao
            ? classification[item.classificacao]
            : 'N/A',
          material: item.material.material,
          unity: item.material.unidade,
          category: item.material?.categoryMaterial?.descricao,
          inCome,
          valueIn:
            item.stockIn.length > 0
              ? item.stockIn[item.stockIn.length - 1].valor_unitario
              : 0,
          outCome,
          valueOut:
            item.materialServiceOrder.length > 0
              ? item.materialServiceOrder[item.materialServiceOrder.length - 1]
                  .valor_unidade
              : 0,
          previousBalance,
          accumulatedBalance: previousBalance + (inCome - outCome),
        });
      });

      currentDate.setDate(currentDate.getDate() + 1);

      // allStock.push({
      //   id: material.,
      // });p
    }

    // Ordenando do mais antigo para o mais recente
    allStock.sort(
      (a, b) =>
        new Date(a.currentDate).getTime() - new Date(b.currentDate).getTime(),
    );

    return {
      data: allStock,
      success: true,
    };
  }
}
