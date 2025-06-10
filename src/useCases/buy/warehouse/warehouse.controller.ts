import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import UpdatedResponseSwagger from 'src/models/swagger/updated-response';
import BuyItemRepository from 'src/repositories/buy-item-repository';
import BuyRepository from 'src/repositories/buy-repository';
import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
import MaterialRepository from 'src/repositories/material-repository';
import MaterialStockWithDrawalRepository from 'src/repositories/material-stock-withdrawal-repository';
import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';

@ApiTags('Buy - Warehouse')
@Controller('/buy/warehouse')
export default class WarehouseController {
  constructor(
    private materialEstoqueRepository: MaterialEstoqueRepository,
    private materialRepository: MaterialRepository,
    private buyRepository: BuyRepository,
    private materialStockWithDrawalRepository: MaterialStockWithDrawalRepository,
    private fileService: FileService,
    private envService: ENVService,
    private stockInventory: StockInventoryRepository,
    private buyItemRepository: BuyItemRepository,
  ) {}
  @UseGuards(AuthGuard)
  @Get('/')
  async listMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      numberRequest: z.coerce.number().optional().nullable(),
      branch: z.array(z.coerce.number()).optional().nullable(),
      material: z.array(z.coerce.number()).optional().nullable(),
      unity: z.string().optional().nullable(),
      secondaryCode: z.string().optional().nullable(),
      industry: z.string().optional().nullable(),
      classification: z.array(z.coerce.number()).optional().nullable(),
      status: z.array(z.coerce.number()).optional().nullable(),
      userApproved: z.enum(['on', 'off']).optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const data = await this.materialEstoqueRepository.findByMaterialAndEstoque(
      user.branches,
      {
        AND: [
          {
            ...(query.numberRequest && {
              buy: {
                numero: {
                  equals: query.numberRequest,
                },
              },
            }),
          },
          {
            ...(query.branch &&
              query.branch.length > 0 && {
                buy: {
                  branch: {
                    ID: {
                      in: query.branch,
                    },
                  },
                },
              }),
          },
          {
            ...(query.material &&
              query.material.length > 0 && {
                material: {
                  id: {
                    in: query.material,
                  },
                },
              }),
          },
          {
            ...(query.unity &&
              query.unity !== '' && {
                material: {
                  unidade: {
                    contains: query.unity,
                  },
                },
              }),
          },
          {
            ...(query.secondaryCode &&
              query.secondaryCode !== '' && {
                materialCodigo: {
                  codigo: {
                    contains: query.secondaryCode,
                  },
                },
              }),
          },
          {
            ...(query.industry &&
              query.industry !== '' && {
                materialCodigo: {
                  marca: {
                    contains: query.industry,
                  },
                },
              }),
          },
          {
            ...(query.classification !== null &&
              query.classification !== undefined && {
                materialCodigo: {
                  classificacao: {
                    in: query.classification,
                  },
                },
              }),
          },
          {
            ...(query.status &&
              query.status.length > 0 && {
                status: { in: query.status },
              }),
          },
          {
            ...(query.userApproved && {
              log_user:
                query.userApproved === 'on'
                  ? {
                      not: null,
                    }
                  : null,
            }),
          },
        ],
      },
    );

    const allMaterialsSecondStock =
      data.length > 0
        ? await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            data.map((value) => value.id_material_secundario),
          )
        : [];

    const classification = {
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada',
    };

    const response = data.map((item) => {
      const findSecond = allMaterialsSecondStock.find(
        (second) => second.id === item.id_material_secundario,
      );

      const stock = findSecond ? findSecond.entrada - findSecond.saida : 0;

      const reserve = findSecond ? Number(findSecond.reserva) : 0;

      const stockPhysical = stock - reserve;

      return {
        id: item.id,
        code_ncm: item.buy.numero,
        branchId: item.buy.branch.ID,
        branch: item.buy.branch.filial_numero,
        materialId: item.material.id,
        material: item.material.material,
        unit: item.material.unidade,
        center_cost:
          item.itemBuy?.compositionItem?.compositionGroup?.costCenter
            ?.centro_custo || 'N/A',
        itens_composition:
          (item.itemBuy?.compositionItem?.composicao || '') +
          (item.itemBuy?.compositionItem?.descricao || ''),
        code_secondary: item.materialCodigo
          ? {
              id: item.materialCodigo.id,
              label: item.materialCodigo.codigo,
            }
          : null,
        industry: item.materialCodigo?.marca || 'N/A',
        classification: item.materialCodigo?.classificacao
          ? classification[item.materialCodigo.classificacao]
          : 'N/A',
        quantity_request: item.quantidade,
        stock,
        reserveTotal: reserve,
        stockPhysical,
        status:
          item.status === 0
            ? 'Reprovado'
            : item.status === 1
            ? 'Confirmado'
            : 'Pendente',
        withdrawal: item.retirada === 1,
        responsible: item.stockWithdrawal.length
          ? item.stockWithdrawal[0].responsavel
          : 0,
        dateWithdrawal: item.stockWithdrawal.length
          ? item.stockWithdrawal[0].log_date
          : null,
        url: item.stockWithdrawal.length ? item.stockWithdrawal[0].url : 0,
        user_aprove: item.log_user,
      };
    });

    return response;
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: UpdatedResponseSwagger,
  })
  @Put('/')
  async UpdateMaterialStatus(@Req() req) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      material: z.array(z.coerce.number()),
      status: z.number(),
    });

    const body = bodySchema.parse(req.body);

    for await (const id of body.material) {
      const material = await this.materialEstoqueRepository.findOne({
        id: Number(id),
      });

      if (!material) {
        throw new NotFoundException(MessageService.Material_stock_id_not_found);
      }

      if (material.status !== 1) {
        await this.materialEstoqueRepository.update(Number(id), {
          status: body.status,
          log_user: user.login,
        });

        const itensCompra =
          await this.materialEstoqueRepository.findManyByCompra(
            material.buy.id,
          );

        const everyStatus = itensCompra.every(
          (item) => item.status === body.status,
        );

        if (everyStatus) {
          if (material.buy.status !== 2) {
            await this.buyRepository.update(material.buy.id, {
              status: material.buy.item.every((value) => value.estoque === 1)
                ? 12 // Aguardando Retirada
                : 2, // Solicitado
            });

            if (body.status === 0) {
              if (material.id_item_material_servico) {
                await this.materialEstoqueRepository.delete(material.id);
                await this.buyRepository.delete(material.buy.id);
              } else {
                for await (const item of itensCompra) {
                  await this.buyItemRepository.update(item.id_item, {
                    estoque: 0,
                  });
                }
              }
            }
          }
        }
      }
    }

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/secondary-code')
  async updateSecondaryCode(@Req() req, @Param('id') id: string) {
    const bodySchema = z.object({
      codeSecundary: z.number().optional(),
    });

    const body = bodySchema.parse(req.body);

    const material = await this.materialEstoqueRepository.findById(Number(id));

    if (!material) {
      throw new NotFoundException(MessageService.Material_stock_id_not_found);
    }

    await this.buyItemRepository.update(material.itemBuy.id, {
      id_material_secundario: body.codeSecundary,
    });

    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/withdrawal')
  async listWithDrawal(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      numberRequest: z.coerce.number().optional().nullable(),
      branch: z.array(z.coerce.number()).optional().nullable(),
      material: z.array(z.coerce.number()).optional().nullable(),
      unity: z.string().optional().nullable(),
      secondaryCode: z.string().optional().nullable(),
      industry: z.string().optional().nullable(),
      classification: z.array(z.coerce.number()).optional().nullable(),
      status: z.array(z.coerce.number()).optional().nullable(),
      userApproved: z.enum(['on', 'off']).optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const listWithDrawal = await this.materialEstoqueRepository.listWithDrawal(
      user.branches,
      {
        AND: [
          {
            ...(query.numberRequest && {
              buy: {
                numero: {
                  equals: query.numberRequest,
                },
              },
            }),
          },
          {
            ...(query.branch &&
              query.branch.length > 0 && {
                buy: {
                  branch: {
                    ID: {
                      in: query.branch,
                    },
                  },
                },
              }),
          },
          {
            ...(query.material &&
              query.material.length > 0 && {
                material: {
                  id: {
                    in: query.material,
                  },
                },
              }),
          },
          {
            ...(query.unity &&
              query.unity !== '' && {
                material: {
                  unidade: {
                    contains: query.unity,
                  },
                },
              }),
          },
          {
            ...(query.secondaryCode &&
              query.secondaryCode !== '' && {
                materialCodigo: {
                  codigo: {
                    contains: query.secondaryCode,
                  },
                },
              }),
          },
          {
            ...(query.industry &&
              query.industry !== '' && {
                materialCodigo: {
                  marca: {
                    contains: query.industry,
                  },
                },
              }),
          },
          {
            ...(query.classification !== null &&
              query.classification !== undefined && {
                materialCodigo: {
                  classificacao: {
                    in: query.classification,
                  },
                },
              }),
          },
          {
            ...(query.status &&
              query.status.length > 0 && {
                retirada: { in: query.status },
              }),
          },
          // {
          //   ...(query.userApproved && {
          //     log_user:
          //       query.userApproved === 'on'
          //         ? {
          //             not: null,
          //           }
          //         : null,
          //   }),
          // },
        ],
      },
    );

    const allMaterialsSecondStock =
      listWithDrawal.length > 0
        ? await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            listWithDrawal.map((value) => value.id_material_secundario),
          )
        : [];

    const response = listWithDrawal.map((item) => {
      const findSecond = allMaterialsSecondStock.find(
        (second) => second.id === item.id_material_secundario,
      );

      const stock = findSecond ? findSecond.entrada - findSecond.saida : 0;

      const reserve = findSecond ? Number(findSecond.reserva) : 0;

      const stockPhysical = stock - reserve;

      const classification = {
        '1': 'Original',
        '2': 'Genuína',
        '3': 'Genérica',
        '4': 'Paralela',
        '5': 'Recondicionada',
      };

      return {
        id: item.id,
        code_ncm: item.buy.numero,
        branch: item.buy.branch.filial_numero,
        material: item.material.material,
        unit: item.material.unidade,
        center_cost:
          item.itemBuy?.compositionItem?.compositionGroup?.costCenter
            ?.centro_custo || 'N/A',
        itens_composition:
          (item.itemBuy?.compositionItem?.composicao || '') +
          (item.itemBuy?.compositionItem?.descricao || ''),
        code_secondary: item.materialCodigo
          ? {
              id: item.materialCodigo.id,
              label: item.materialCodigo.codigo,
            }
          : null,
        industry: item.materialCodigo?.marca || 'N/A',
        classification: item.materialCodigo?.classificacao
          ? classification[item.materialCodigo.classificacao]
          : 'N/A',
        quantity_request: item.quantidade,
        stock,
        reserveTotal: reserve,
        stockPhysical,
        status: item.retirada === 1 ? 'Confirmado' : 'Pendente',
        responsible:
          item.stockWithdrawal.length > 0
            ? item.stockWithdrawal[0].responsavel
            : null,
        url:
          item.stockWithdrawal.length > 0 ? item.stockWithdrawal[0].url : null,
        observation:
          item.stockWithdrawal.length > 0
            ? item.stockWithdrawal[0].observacao
            : null,
        withdrawal: item.retirada === 1,
        dateWithdrawal: item.stockWithdrawal.length
          ? item.stockWithdrawal[0].log_date
          : null,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/withdrawal')
  async updatedWithDrawal(@Req() req) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      responsible: z.string(),
      material: z.array(z.coerce.number()),
      signature: z.string(),
      observation: z.string().optional().nullable(),
    });

    const body = bodySchema.parse(req.body);

    // Remover o prefixo 'data:image/png;base64,' (ou outro tipo MIME) da string Base64
    const base64String = body.signature.replace(
      /^data:image\/[a-zA-Z+]+;base64,/,
      '',
    );
    const signatureBuffer = Buffer.from(base64String, 'base64');

    const buyFilter = [];

    for await (const id of body.material) {
      const withdrawal = await this.materialEstoqueRepository.findById(
        Number(id),
      );

      if (!withdrawal) {
        throw new NotFoundException(
          MessageService.Material_stock_withdrawal_id_not_found,
        );
      }

      const listPath = this.fileService.list(
        `${this.envService.FILE_PATH}/material/withdrawal_signature`,
      );

      for await (const item of listPath) {
        this.fileService.delete(item);
      }

      const path = `${this.envService.FILE_PATH}/material/withdrawal_signature/${withdrawal.id}/`;

      this.fileService.write(
        path,
        `assinatura_${withdrawal.id}.png`,
        signatureBuffer,
      );

      if (withdrawal.stockWithdrawal.length) {
        if (withdrawal.retirada !== 1) {
          await this.materialEstoqueRepository.update(withdrawal.id, {
            retirada: 1,
          });

          await this.stockInventory.create({
            id_codigo: withdrawal.id_material_secundario,
            id_produto: withdrawal.id_material,
            data_entrada: new Date(),
            id_filial: withdrawal.id_filial,
            log_user: user.login,
            numero_serie: withdrawal.buy
              ? withdrawal.buy.numero.toString().padStart(6, '0')
              : withdrawal.itemMaterial.serviceOrder.ordem,
            quantidade: withdrawal.quantidade,
            valor_unitario: 1,
          });
        }

        await this.materialStockWithDrawalRepository.update(
          withdrawal.stockWithdrawal[0].id,
          {
            responsavel: body.responsible,
            url: path,
            observacao: body.observation,
          },
        );

        if (withdrawal.buy.id) {
          const index = buyFilter.findIndex(
            (value) => value === withdrawal.buy.id,
          );

          if (index === -1) {
            buyFilter.push(withdrawal.buy.id);
          }
        }
      } else {
        if (withdrawal.retirada !== 1) {
          await this.materialEstoqueRepository.update(withdrawal.id, {
            retirada: 1,
          });

          // await this.stockRepository.create({
          //   id_filial: withdrawal.id_filial,
          //   data_entrada: new Date(),
          //   log_user: user.login,
          //   numero_documento: withdrawal.buy.numero.toString().padStart(6, '0'),
          // });

          await this.stockInventory.create({
            id_codigo: withdrawal.id_material_secundario,
            id_produto: withdrawal.id_material,
            data_entrada: new Date(),
            id_filial: withdrawal.id_filial,
            log_user: user.login,
            numero_serie: withdrawal.buy
              ? withdrawal.buy.numero.toString().padStart(6, '0')
              : withdrawal.itemMaterial.serviceOrder.ordem,
            quantidade: withdrawal.quantidade,
            valor_unitario: 1,
          });
        }

        await this.materialStockWithDrawalRepository.create({
          id_cliente: user.clientId,
          id_filial: withdrawal.id_filial,
          id_estoque: withdrawal.id,
          id_material: withdrawal.id_material,
          id_material_secondario: withdrawal.id_material_secundario,
          quantidade: withdrawal.quantidade,
          id_item: withdrawal.id_item,
          status: 1,
          responsavel: body.responsible,
          url: path,
          observacao: body.observation,
        });

        if (withdrawal.buy.id) {
          const index = buyFilter.findIndex(
            (value) => value === withdrawal.buy.id,
          );

          if (index === -1) {
            buyFilter.push(withdrawal.buy.id);
          }
        }
      }
    }

    for await (const buyId of buyFilter) {
      await this.buyRepository.update(buyId, {
        status: 13,
      });
    }

    return {
      updated: true,
    };
  }
}
