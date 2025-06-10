import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
import CreateOutBodySwagger from './dtos/swagger/createOut-body';
import InsertedResponseSwagger from 'src/models/swagger/inserted-response';
import DeletedResponseSwagger from 'src/models/swagger/delete-response';
import UpdatedResponseSwagger from 'src/models/swagger/updated-response';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import MaterialRepository from 'src/repositories/material-repository';
import MaintenanceControlStockRepository from 'src/repositories/maintenance-control-stock-repository';

@ApiTags('Maintenance - Stock - Out')
@ApiBearerAuth()
@Controller('/maintenance/stock/out')
export default class OutController {
  constructor(
    private stockInventory: StockInventoryRepository,
    private materialCodeRepository: MaterialCodeRepository,
    private materialRepository: MaterialRepository,
    private maintenanceControlStockRepository: MaintenanceControlStockRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async listOut(@Req() req) {
    const querySchema = z.object({
      index: z.coerce.number().optional().nullable().default(0),
      perPage: z.coerce.number().optional().nullable().default(10),
      branch: z.string().optional().nullable(),
      code: z.string().optional().nullable(),
      material: z.string().optional().nullable(),
      date: z.string().optional().nullable(),
      serial: z.string().optional().nullable(),
      observation: z.string().optional().nullable(),
      quantity: z.coerce.number().optional().nullable(),
      unity: z.string().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const user: IUserInfo = req.user;

    const out = await this.stockInventory.listOut(
      user.branches,
      query.index,
      query.perPage,
      {
        ...(query.branch &&
          query.branch.length > 0 && {
            branch: {
              filial_numero: {
                contains: query.branch,
              },
            },
          }),

        ...(query.material &&
          query.material.length > 0 && {
            materialCodigo: {
              codigo: {
                contains: query.code,
              },
            },
          }),

        ...(query.material &&
          query.material.length > 0 && {
            material: {
              material: {
                contains: query.material,
              },
            },
          }),

        ...(query.date && {
          data_entrada: query.date,
        }),

        ...(query.serial &&
          query.serial.length > 0 && {
            numero_serie: {
              contains: query.serial,
            },
          }),

        ...(query.observation &&
          query.observation.length > 0 && {
            observacao: {
              contains: query.observation,
            },
          }),

        ...(query.unity && {
          material: {
            unidade: {
              contains: query.unity,
            },
          },
        }),

        ...(query.quantity && {
          quantidade: query.quantity,
        }),
      },
    );

    const count = await this.stockInventory.countList(user.branches);

    const response = out.map((item) => {
      return {
        id: item.id,
        branch: {
          id: item.branch.ID,
          name: item.branch.filial_numero,
        },
        material: item.material.material,
        code: item?.materialCodigo?.codigo
          ? {
              id: item.materialCodigo.id,
              name: item.materialCodigo.codigo,
            }
          : null,
        unity: item.material.unidade,
        quantity: item.quantidade,
        value: item.valor_unitario,
        total: Number(item.quantidade) * Number(item.valor_unitario),
        observation: item.observacao,
        serial: item.numero_serie,
        date: item.data_entrada,
      };
    });

    return {
      rows: response,
      totalItem: count,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateOutBodySwagger,
  })
  @ApiResponse({
    type: InsertedResponseSwagger,
  })
  @Post('/')
  async createOut(@Req() req) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      branchId: z.number(),
      secondaryId: z.number(),
      quantity: z.number(),
      value: z.number(),
      date: z.coerce.date().optional().nullable(),
      observation: z.string().optional().nullable(),
      serial: z.string().optional().nullable(),
    });

    const body = bodySchema.parse(req.body);

    const materialSecondary = await this.materialCodeRepository.findById(
      body.secondaryId,
    );

    if (!materialSecondary) {
      throw new NotFoundException(MessageService.Material_code_not_found);
    }

    const controlStock =
      await this.maintenanceControlStockRepository.listByClient(user.clientId);

    if (controlStock) {
      const findBranch = controlStock.find(
        (item) => item.id_filial === body.branchId,
      );

      if (findBranch) {
        const allMaterialsSecondStock =
          await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            [materialSecondary.id],
          );

        const findSecond = allMaterialsSecondStock.find(
          (second) => second.id === materialSecondary.id,
        );

        if (!findSecond) {
          throw new NotFoundException(
            MessageService.Service_order_material_quantity_larger_stock,
          );
        }

        const stock = findSecond ? findSecond.entrada - findSecond.saida : 0;

        const reserve = findSecond ? findSecond.reserva : 0;

        const stockPhysical = stock - reserve;

        if (findBranch.controlar === 1 && stockPhysical < body.quantity) {
          throw new NotFoundException(
            MessageService.Service_order_material_quantity_larger_stock,
          );
        }
      }
    }

    await this.stockInventory.create({
      id_filial: body.branchId,
      id_produto: materialSecondary.material.id,
      id_codigo: materialSecondary.id,
      quantidade: body.quantity,
      valor_unitario: body.value,
      observacao: body.observation,
      numero_serie: body.serial,
      data_entrada: body.date,
      log_user: user.login,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateOutBodySwagger,
  })
  @ApiResponse({
    type: UpdatedResponseSwagger,
  })
  @Put('/:id')
  async updateOut(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      branchId: z.number(),
      secondaryId: z.number(),
      quantity: z.number(),
      value: z.number(),
      observation: z.string().optional().nullable(),
      date: z.coerce.date().optional().nullable(),
      serial: z.string().optional().nullable(),
    });

    const body = bodySchema.parse(req.body);

    const materialSecondary = await this.materialCodeRepository.findById(
      body.secondaryId,
    );

    if (!materialSecondary) {
      throw new NotFoundException(MessageService.Material_code_not_found);
    }

    const out = await this.stockInventory.findById(Number(id));

    if (!out) {
      throw new NotFoundException(
        MessageService.Maintenance_stock_out_id_not_found,
      );
    }

    const controlStock =
      await this.maintenanceControlStockRepository.listByClient(user.clientId);

    if (controlStock) {
      const findBranch = controlStock.find(
        (item) => item.id_filial === body.branchId,
      );

      if (findBranch) {
        const allMaterialsSecondStock =
          await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            [materialSecondary.id],
          );

        const findSecond = allMaterialsSecondStock.find(
          (second) => second.id === materialSecondary.id,
        );

        if (!findSecond) {
          throw new NotFoundException(
            MessageService.Service_order_material_quantity_larger_stock,
          );
        }

        const stock = findSecond ? findSecond.entrada - findSecond.saida : 0;

        const reserve = findSecond ? findSecond.reserva : 0;

        const stockPhysical = stock - reserve;

        if (findBranch.controlar === 1 && stockPhysical < body.quantity) {
          throw new NotFoundException(
            MessageService.Service_order_material_quantity_larger_stock,
          );
        }
      }
    }

    await this.stockInventory.update(out.id, {
      id_filial: body.branchId,
      id_produto: materialSecondary.material.id,
      id_codigo: materialSecondary.id,
      quantidade: body.quantity,
      valor_unitario: body.value,
      observacao: body.observation,
      numero_serie: body.serial,
      data_entrada: body.date,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateOutBodySwagger,
  })
  @ApiResponse({
    type: DeletedResponseSwagger,
  })
  @Delete('/:id')
  async deleted(@Req() req, @Param('id') id: string) {
    const out = await this.stockInventory.findById(Number(id));

    if (!out) {
      throw new NotFoundException(
        MessageService.Maintenance_stock_out_id_not_found,
      );
    }

    await this.stockInventory.delete(out.id);

    return {
      deleted: true,
    };
  }
}
