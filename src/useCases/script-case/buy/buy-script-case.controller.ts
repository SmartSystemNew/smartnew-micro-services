import {
  BadRequestException,
  ConflictException,
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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import listTablePaginationSwagger from 'src/models/swagger/list-table-pagination-swagger';
import BuyConfigurationRepository from 'src/repositories/buy-configuration-repository';
import BuyItemRepository from 'src/repositories/buy-item-repository';
import BuyPriorityRepository from 'src/repositories/buy-priority-repository';
import BuyRelaunchRepository from 'src/repositories/buy-relaunch-repository';
import BuyRepository from 'src/repositories/buy-repository';
import BuyResponsibleRepository from 'src/repositories/buy-responsible-repository';
import BuyStatusRepository from 'src/repositories/buy-status-repository';
import { CompositionItemRepository } from 'src/repositories/composition-item-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
import MaterialRepository from 'src/repositories/material-repository';
import ProviderRepository from 'src/repositories/provider-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';

@ApiTags('Script Case - Buy')
@Controller('/script-case/buy')
export default class BuyController {
  constructor(
    private buyPriorityRepository: BuyPriorityRepository,
    private buyRepository: BuyRepository,
    private buyItemRepository: BuyItemRepository,
    private equipmentRepository: EquipmentRepository,
    private orderServiceRepository: ServiceOrderRepository,
    private materialRepository: MaterialRepository,
    private compositionItemRepository: CompositionItemRepository,
    private buyStatusRepository: BuyStatusRepository,
    private providerRepository: ProviderRepository,
    private buyConfigurationRepository: BuyConfigurationRepository,
    private materialEstoqueRepository: MaterialEstoqueRepository,
    private materialCodeRepository: MaterialCodeRepository,
    private buyResponsibleRepository: BuyResponsibleRepository,
    private buyRelaunchRepository: BuyRelaunchRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/list-provider')
  async listProvider(@Req() req) {
    const user: IUserInfo = req.user;

    const allProvider = await this.providerRepository.listByBranches(
      user.branches,
      user.clientId,
    );
    //console.log(user);
    const querySchema = z.object({
      type: z.string().optional().default('provider'),
    });

    const query = querySchema.parse(req.query);

    const provider = allProvider.map((provider) => {
      return {
        value: provider.ID,
        text: `${provider.razao_social} ${provider.cnpj}`,
      };
    });

    return {
      [query.type]: provider,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-priority')
  async listBuyPriority(@Req() req) {
    const user: IUserInfo = req.user;

    const allPriority = await this.buyPriorityRepository.listByClient(
      user.clientId,
    );

    const querySchema = z.object({
      type: z.string().optional().default('priority'),
    });

    const query = querySchema.parse(req.query);

    return {
      [query.type]: allPriority.map((value) => {
        return {
          value: value.id,
          text: value.name,
          deadline: value.prazo,
        };
      }),
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-bound')
  async listBound(@Req() req) {
    const user: IUserInfo = req.user;

    const response = [
      {
        text: 'Estoque',
        value: 'stock',
      },
    ];

    const querySchema = z.object({
      type: z.string().optional().default('priority'),
    });

    const query = querySchema.parse(req.query);

    const allBound = await this.buyConfigurationRepository.findByClient(
      user.clientId,
    );

    if (allBound) {
      if (allBound.ordem_servico) {
        response.push({
          text: 'OS',
          value: 'os',
        });
      }
      if (allBound.equipamento) {
        response.push({
          text: 'Equipamento',
          value: 'equipment',
        });
      }
    }

    return {
      [query.type]: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-status')
  async listStatus(@Req() req) {
    const querySchema = z.object({
      type: z.string().optional().default('status'),
    });

    const query = querySchema.parse(req.query);

    const allStatus = await this.buyStatusRepository.list();

    return {
      [query.type]: allStatus.map((value) => {
        return {
          value: value.id,
          text: value.descricao,
        };
      }),
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiQuery({
    type: listTablePaginationSwagger,
  })
  @Get('/list-request')
  async listRequest(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      page: z.coerce
        .string()
        .optional()
        .nullable()
        .transform((value) =>
          value === 'null'
            ? null
            : value === undefined || value.length === 0
            ? null
            : Number(value) - 1,
        ),
      perPage: z.coerce
        .string()
        .optional()
        .nullable()
        .transform((value) =>
          value === 'null'
            ? null
            : value === undefined || value.length === 0
            ? null
            : Number(value),
        ),
      globalFilter: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      filterColumn: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      filterText: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      dateFrom: z
        .string()
        .transform((value) => (value === '' ? null : new Date(value)))
        .optional(),
      dateTo: z
        .string()
        .transform((value) => (value === '' ? null : new Date(value)))
        .optional(),
      status: z
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
    });

    const query = querySchema.parse(req.query);

    // console.log(user);
    // console.log(query);

    let filterText = {};

    if (query.filterColumn) {
      switch (query.filterColumn) {
        case 'number':
          filterText = {
            numero: {
              equals: Number(query.filterText),
            },
          };
          break;
        case 'branch':
          filterText = {
            branch: {
              filial_numero: {
                contains: query.filterText,
              },
            },
          };
          break;
        case 'status':
          filterText = {
            buyStatus: {
              descricao: {
                contains: query.filterText,
              },
            },
          };
          break;
        case 'emission':
          if (query.dateFrom && query.dateTo) {
            filterText = {
              logBuy: {
                log_date: {
                  gte: query.dateFrom,
                  lte: query.dateTo,
                },
              },
            };
          }
          break;
        case 'userEmission':
          filterText = {
            user: {
              name: {
                contains: query.filterText,
              },
            },
          };
          break;
        case 'observation':
          filterText = {
            observacao: {
              contains: query.filterText,
            },
          };
          break;
      }
    }

    const allBuy = await this.buyRepository.listByClientAndFilterGrid(
      user.clientId,
      query.page,
      query.perPage,
      {
        AND: [
          ...(query.globalFilter
            ? [
                {
                  OR: [
                    {
                      numero: {
                        equals: Number(query.globalFilter),
                      },
                    },
                    {
                      observacao: {
                        contains: query.globalFilter,
                      },
                    },
                    {
                      user: {
                        name: {
                          contains: query.globalFilter,
                        },
                      },
                    },
                    {
                      buyStatus: {
                        descricao: {
                          contains: query.globalFilter,
                        },
                      },
                    },
                    {
                      branch: {
                        filial_numero: {
                          contains: query.globalFilter,
                        },
                      },
                    },
                  ],
                },
              ]
            : []),
          ...(query.status ? [{ status: { in: query.status } }] : []),
          filterText,
        ],
      },
    );

    const totalBuy = await this.buyRepository.listByClientAndFilterGrid(
      user.clientId,
      null,
      null,
      {},
    );

    const response = allBuy.map((buy) => {
      //console.log(buy);
      return {
        number: buy.numero.toString().padStart(6, '0'),
        branch: buy.branch.filial_numero,
        emission:
          buy.logBuy.length >= 1 ? buy.logBuy[0].log_date : buy.log_date,
        id: buy.id,
        observation: buy.observacao,
        statusId: buy.buyStatus.id,
        status: buy.buyStatus.descricao,
        userEmission: buy?.user?.name,
      };
    });

    return {
      success: true,
      data: response,
      totalItems: totalBuy.length,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async createBuy(@Req() req) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      branchId: z.number(),
      observation: z.string().optional().nullable(),
    });

    const body = bodySchema.parse(req.body);

    const buy = await this.buyRepository.create({
      id_cliente: user.clientId,
      id_filial: body.branchId,
      log_user: user.login,
      observacao: body.observation,
      buyPreFinance: {
        create: {
          emitente: body.branchId,
        },
      },
    });

    return {
      inserted: true,
      success: true,
      id: buy.id,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findById(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const buy = await this.buyRepository.findById(Number(id));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    // Verifica se há alguma cotação nos itens
    const hasQuotations =
      buy.item.length > 0
        ? buy.item.some(
            (item) => item.quotationItem && item.quotationItem.length > 0,
          )
        : false;

    // Verifica se todos os itens com cotações foram aprovados (cenário 1)
    const allItemsSelect = hasQuotations
      ? buy.item.every((value) => {
          // Se o item não tem cotações, consideramos "não aplicável" (true para não afetar Partial)
          if (!value.quotationItem || value.quotationItem.length === 0) {
            return true;
          }
          return value.quotationItem.some((quotation) =>
            quotation.quotationSelected.some((select) => select.aprovado === 1),
          );
        })
      : true; // Se não há cotações, consideramos como "não falhou"

    // Verifica se as quantidades batem para os itens aprovados (cenário 2)
    const allItemsSelectWithQuantity = hasQuotations
      ? buy.item.every((item) => {
          // Se o item não tem cotações, consideramos "não aplicável" (true para não afetar Partial)
          if (!item.quotationItem || item.quotationItem.length === 0) {
            return true;
          }
          const quotationSelect = item.quotationItem.find((quotation) =>
            quotation.quotationSelected.some((select) => select.aprovado === 1),
          );
          if (!quotationSelect) {
            return true; // A verificação de "não aprovado" será feita em allItemsSelect
          }
          return quotationSelect.quantidade === item.quantidade;
        })
      : true; // Se não há cotações, consideramos como "não falhou"

    const response = {
      cancel: buy.buyStatus.id === 8,
      info: {
        requester: {
          id: buy.branch.ID,
          name: buy.branch.filial_numero,
        },
        observation: buy.observacao,
        statusId: buy.status,
        status: buy.buyStatus.descricao,
        issuer: buy?.user?.login,
        emission: buy.log_date,
        number_buy: buy.numero,
        buyRelaunch:
          buy.buyRelaunchOwn.length > 0
            ? buy.buyRelaunchOwn[0].novo_id_compra
            : false,
        user: {
          name: user.login,
          department: [],
        },
      },
      status:
        buy.buyApprobation.length &&
        buy.buyApprobation.every((value) => value.aprovado === 1)
          ? 'Approved'
          : 'indeterminate',
      partial: hasQuotations
        ? !(allItemsSelect && allItemsSelectWithQuantity) // Partial é true se qualquer cenário falhar
        : false, // Se não há cotações, não é Partial
      // buy.item.length > 0
      //   ? allItemsSelect !== null && allItemsSelect === false
      //     ? true
      //     : allItemsSelectWithQuantity !== null &&
      //       allItemsSelectWithQuantity === false
      //     ? true
      //     : false
      //   : false,
    };

    return { ...response, success: true };
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateBuy(@Req() req, @Param('id') id: string) {
    const bodySchema = z.object({
      statusId: z.number(),
      observation: z.string().optional().nullable(),
    });

    const body = bodySchema.parse(req.body);

    const buy = await this.buyRepository.findById(Number(id));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    await this.buyRepository.update(buy.id, {
      observacao: body.observation,
      status: body.statusId,
    });

    return {
      success: true,
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id/material/:materialId/secondary-code')
  async listMaterialBySecondaryCode(
    @Req() req,
    @Param('id') id: string,
    @Param('materialId') materialId: number,
  ) {
    const user: IUserInfo = req.user;

    const buy = await this.buyRepository.findById(Number(id));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const material = await this.materialRepository.findById(Number(materialId));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    const materialCode = await this.materialCodeRepository.lisByMaterialAndCode(
      Number(materialId),
    );

    const allMaterialsSecondStock =
      materialCode.length > 0
        ? await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            materialCode.map((value) => value.id),
          )
        : [];

    const response = [];

    for await (const value of materialCode) {
      const findSecond = allMaterialsSecondStock.find(
        (second) => second.id === value.id,
      );

      const stock = findSecond ? findSecond.entrada - findSecond.saida : 0;

      const reserve = findSecond ? findSecond.reserva : 0;

      const stockPhysical = stock - reserve;

      const totalItemSelected = buy.item.reduce((acc, current) => {
        if (current.materialSecond.id === value.id) {
          return acc + current.quantidade;
        } else {
          return acc + 0;
        }
      }, 0);

      response.push({
        id: value.id,
        code: value.codigo,
        specification: value.especificacao,
        classification: value.classificacao,
        manufacture: value.marca,
        quantity: stockPhysical - totalItemSelected,
      });
    }

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id/item')
  async findByItem(@Param('id') id: string) {
    const buy = await this.buyRepository.findById(Number(id));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    const allItem = await this.buyItemRepository.listByBuy(buy.id);

    const classification = {
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada',
    };

    const response = {
      items: allItem.map((item) => {
        return {
          id: item.id,
          sequency: item.sequencia,
          quantity: item.quantidade,
          observation: item.observacao,
          bound: item.vinculo,
          deadline: item.priority.prazo,
          cost_center: item.compositionItem
            ? `${item.compositionItem.compositionGroup.costCenter.centro_custo}-${item.compositionItem.compositionGroup.costCenter.descricao}`
            : null,
          composition: item.compositionItem
            ? {
                value: item.compositionItem.id,
                text: `${item.compositionItem.composicao}-${item.compositionItem.descricao}`,
              }
            : null,
          material: {
            id: item.material.id,
            name: `${item.material.material}`,
            department:
              item.material.categoryMaterial?.departmentCategory.length > 0
                ? item.material.categoryMaterial?.departmentCategory[0].id
                : null,
            unity: item?.material?.unidade,
            secondaryCode: item.materialSecond
              ? {
                  value: item.materialSecond.id,
                  text: item.materialSecond.codigo,
                }
              : null,
          },
          unity: item?.material?.unidade,
          brand: item.materialSecond ? item.materialSecond.marca : '',
          classification: item.materialSecond.classificacao
            ? classification[item.materialSecond.classificacao]
            : '',
          item_bound:
            item.vinculo === 'equipment'
              ? {
                  id: item.equipment.ID,
                  name: `${item.equipment.equipamento_codigo}-${item.equipment.descricao}`,
                }
              : item.vinculo === 'os'
              ? {
                  id: item.serviceOrder.ID,
                  name: `${item.serviceOrder.ordem}-${item.serviceOrder.equipment.equipamento_codigo}-${item.serviceOrder.equipment.descricao}`,
                }
              : null,
          priority: {
            id: item.priority.id,
            name: item.priority.name,
          },
          stock: item.estoque === 1,
          withDrawal:
            item.materialStock.length > 0
              ? item.materialStock[0].stockWithdrawal.length > 0
                ? {
                    date: item.materialStock[0].stockWithdrawal[0].log_date,
                    responsable:
                      item.materialStock[0].stockWithdrawal[0].responsavel,
                  }
                : {
                    date: null,
                    responsable: null,
                  }
              : {
                  date: null,
                  responsable: null,
                },
        };
      }),
    };

    return {
      ...response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id/item')
  async insertItem(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      bound: z.enum(['stock', 'equipment', 'os']).optional().nullable(),
      item_bound: z.coerce.number().optional().nullable(),
      stock: z.coerce.boolean(),
      id_secondary: z.coerce.number(),
      material: z.coerce.number(),
      unity: z.coerce.string().optional().nullable(),
      cost_center: z.coerce.number().optional().nullable(),
      quantity: z.coerce.number(),
      observation: z.coerce.string().optional().nullable(),
      priority: z.coerce.number(),
      deadline: z.coerce.string(),
      login: z.coerce.string(),
    });

    const body = bodySchema.parse(req.body);

    const buy = await this.buyRepository.findById(Number(id));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    let bound: null | 'stock' | 'equipment' | 'os' = null;
    let equipmentId: number | null = null;
    let orderId: number | null = null;

    if (body.bound === 'equipment' && body.item_bound !== null) {
      const equipment = await this.equipmentRepository.findById(
        Number(body.item_bound),
      );

      if (!equipment) {
        throw new NotFoundException({
          message: MessageService.Equipment_not_found,
          success: false,
        });
      }
      bound = body.bound;
      equipmentId = equipment.ID;
    } else if (body.bound === 'os' && body.item_bound !== null) {
      const order = await this.orderServiceRepository.findById(
        Number(body.item_bound),
      );

      if (!order) {
        throw new NotFoundException({
          message: MessageService.Service_order_id_not_found,
          success: false,
        });
      }

      bound = body.bound;
      orderId = order.ID;
    } else if (bound === 'stock') {
      bound = 'stock';
    }

    if (
      body.bound !== null &&
      body.bound !== 'stock' &&
      !equipmentId &&
      !orderId
    ) {
      throw new ConflictException({
        message: MessageService.Buy_item_bound_not_found,
        success: false,
      });
    }

    const material = await this.materialRepository.findById(
      Number(body.material),
    );

    if (!material) {
      throw new NotFoundException({
        message: MessageService.Material_id_not_found,
      });
    }

    let compositionItemId: null | number = null;

    if (body.cost_center !== null) {
      const compositionItem = await this.compositionItemRepository.findById(
        Number(body.cost_center),
      );

      if (!compositionItem) {
        throw new NotFoundException(
          MessageService.FinanceItem_cost_center_not_found,
        );
      }

      compositionItemId = compositionItem.id;
    }

    const priority = await this.buyPriorityRepository.findById(
      Number(body.priority),
    );

    if (!priority) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
      });
    }

    let id_secondary = body.id_secondary;

    if (material.tipo === 'service') {
      const materialCode = await this.materialCodeRepository.listByMaterial(
        material.id,
      );

      if (materialCode.length > 0) {
        id_secondary = materialCode[0].id;
      } else {
        id_secondary = null;
      }
    } else if (material.tipo === 'stock' && !id_secondary) {
      throw new NotFoundException(MessageService.Material_code_not_found);
    } else if (material.tipo === 'stock') {
      const materialCode =
        await this.materialCodeRepository.findById(id_secondary);

      if (!materialCode) {
        throw new NotFoundException(MessageService.Material_code_not_found);
      }

      if (body.stock) {
        const allMaterialsSecondStock =
          await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            [materialCode.id],
          );

        if (allMaterialsSecondStock.length > 0) {
          const stock =
            allMaterialsSecondStock[0].entrada -
            allMaterialsSecondStock[0].saida;

          const reserve = allMaterialsSecondStock[0].reserva;

          const stockPhysical = stock - reserve;

          if (Number(body.quantity) > stockPhysical)
            throw new ConflictException({
              message: MessageService.Buy_item_quantity_not_stock,
              success: false,
            });
        } else {
          throw new ConflictException({
            message: MessageService.Buy_item_quantity_not_stock,
            success: false,
          });
        }
      }
    }

    await this.buyItemRepository.create({
      id_solicitacao: buy.id,
      id_material: material.id,
      id_material_secundario: id_secondary ? id_secondary : null,
      id_prioridade: priority.id,
      quantidade: Number(body.quantity),
      sequencia: 1,
      vinculo: bound,
      estoque: body.stock ? 1 : 0,
      id_composicao_item: compositionItemId,
      id_equipamento: equipmentId,
      id_os: orderId,
      observacao: body.observation,
    });

    // if (body.stock === true) {
    //   await this.materialEstoqueRepository.create({
    //     id_material: material.id,
    //     id_cliente: material.id_cliente,
    //     id_compra: buy.id,
    //     id_item: item.id,
    //     id_filial: buy.branch.ID,
    //     id_material_secundario: id_secondary,
    //     log_user: body.login,
    //     quantidade: Number(body.quantity),
    //   });
    // }

    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/item/:itemId')
  async updateItem(
    @Req() req,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      bound: z.enum(['stock', 'equipment', 'os']).optional().nullable(),
      item_bound: z.coerce.number().optional().nullable(),
      stock: z.coerce.boolean(),
      id_secondary: z.coerce.number().optional().nullable(),
      material: z.coerce.number(),
      unity: z.coerce.string().optional().nullable(),
      cost_center: z.coerce.number().optional().nullable(),
      quantity: z.coerce.number(),
      observation: z.coerce.string(),
      priority: z.coerce.number(),
      deadline: z.coerce.string(),
      login: z.coerce.string(),
    });

    const body = bodySchema.parse(req.body);

    const buy = await this.buyRepository.findById(Number(id));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    let bound: null | 'stock' | 'equipment' | 'os' = null;
    let equipmentId: number | null = null;
    let orderId: number | null = null;

    if (body.bound === 'equipment' && body.item_bound !== null) {
      const equipment = await this.equipmentRepository.findById(
        Number(body.item_bound),
      );

      if (!equipment) {
        throw new NotFoundException({
          message: MessageService.Equipment_not_found,
          success: false,
        });
      }
      bound = body.bound;
      equipmentId = equipment.ID;
    } else if (body.bound === 'os' && body.item_bound !== null) {
      const order = await this.orderServiceRepository.findById(
        Number(body.item_bound),
      );

      if (!order) {
        throw new NotFoundException({
          message: MessageService.Service_order_id_not_found,
          success: false,
        });
      }

      bound = body.bound;
      orderId = order.ID;
    } else if (bound === 'stock') {
      bound = 'stock';
    }

    if (
      body.bound !== null &&
      body.bound !== 'stock' &&
      !equipmentId &&
      !orderId
    ) {
      throw new ConflictException({
        message: MessageService.Buy_item_bound_not_found,
        success: false,
      });
    }

    const material = await this.materialRepository.findById(
      Number(body.material),
    );

    if (!material) {
      throw new NotFoundException({
        message: MessageService.Material_id_not_found,
      });
    }

    let compositionItemId: null | number = null;

    if (body.cost_center !== null) {
      const compositionItem = await this.compositionItemRepository.findById(
        Number(body.cost_center),
      );

      if (!compositionItem) {
        throw new NotFoundException(
          MessageService.FinanceItem_cost_center_not_found,
        );
      }

      compositionItemId = compositionItem.id;
    }

    const priority = await this.buyPriorityRepository.findById(
      Number(body.priority),
    );

    if (!priority) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
      });
    }

    let id_secondary = body.id_secondary;

    if (material.tipo === 'service') {
      const materialCode = await this.materialCodeRepository.listByMaterial(
        material.id,
      );

      if (materialCode.length > 0) {
        id_secondary = materialCode[0].id;
      } else {
        id_secondary = null;
      }
    } else if (material.tipo === 'stock' && !id_secondary) {
      throw new NotFoundException(MessageService.Material_code_not_found);
    } else if (material.tipo === 'stock') {
      const materialCode =
        await this.materialCodeRepository.findById(id_secondary);

      if (!materialCode) {
        throw new NotFoundException(MessageService.Material_code_not_found);
      }

      if (body.stock) {
        const allMaterialsSecondStock =
          await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            [materialCode.id],
          );

        if (allMaterialsSecondStock.length > 0) {
          const stock =
            allMaterialsSecondStock[0].entrada -
            allMaterialsSecondStock[0].saida;

          const reserve = allMaterialsSecondStock[0].reserva;

          const stockPhysical = stock - reserve;

          if (Number(body.quantity) > stockPhysical)
            throw new ConflictException({
              message: MessageService.Buy_item_quantity_not_stock,
              success: false,
            });
        } else {
          throw new ConflictException({
            message: MessageService.Buy_item_quantity_not_stock,
            success: false,
          });
        }
      }
    }

    await this.buyItemRepository.update(Number(itemId), {
      id_material: material.id,
      id_material_secundario: id_secondary ? id_secondary : null,
      id_prioridade: priority.id,
      quantidade: Number(body.quantity),
      vinculo: bound,
      id_composicao_item: compositionItemId,
      id_equipamento: equipmentId,
      id_os: orderId,
      estoque: body.stock ? 1 : 0,
      observacao: body.observation,
    });

    return {
      updated: true,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/item/:itemId')
  async deleteItem(@Param('itemId') itemId: string) {
    await this.buyItemRepository.delete(Number(itemId));

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/finalize')
  async finalize(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const buy = await this.buyRepository.findById(Number(id));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    const itemUrgente = buy.item.some((item) => item.priority.urgente === true);

    const allItemsUrgente = buy.item.every(
      (item) => item.priority.urgente === true,
    );

    if (itemUrgente && !allItemsUrgente) {
      throw new BadRequestException({
        message: MessageService.Buy_item_conflict_priority_emergency,
        success: false,
      });
    }

    const findBranches = await this.buyResponsibleRepository.listUserByBranch(
      buy.branch.ID,
    );

    if (findBranches.length) {
      const findUser = findBranches.find(
        (value) => value.responsavel === user.login,
      );

      if (!findUser) {
        // throw new ForbiddenException({
        //   message: MessageService.Buy_finalize_not_user_permission,
        //   success: false,
        // });

        await this.buyRepository.update(Number(id), {
          status: 11, // Aguardando Almoxarife
        });

        return {
          success: true,
        };
      }
    }

    let goReserve = false;

    for await (const item of buy.item) {
      if (item.estoque === 1 && item.materialSecond) {
        goReserve = true;

        const validDuplicate =
          await this.materialEstoqueRepository.findByBuyAndItem(
            buy.id,
            item.id,
          );

        if (!validDuplicate)
          await this.materialEstoqueRepository.create({
            id_material: item.material.id,
            id_cliente: user.clientId,
            id_compra: buy.id,
            id_item: item.id,
            id_filial: buy.branch.ID,
            id_material_secundario: item.materialSecond.id,
            quantidade: item.quantidade,
          });
      }
    }

    if (goReserve) {
      await this.buyRepository.update(Number(id), {
        status: 10, // Aguardando Almoxarife
      });
    } else {
      await this.buyRepository.update(Number(id), {
        status: 2, // Solicitado
      });
    }

    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id/relaunch')
  async relaunch(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const buy = await this.buyRepository.findById(Number(id));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    if (
      !buy.item.some((item) =>
        item.quotationItem.some((quotation) =>
          quotation.quotationSelected.some((select) => select.aprovado === 1),
        ),
      )
    ) {
      throw new ConflictException({
        message: MessageService.Buy_not_relaunch_item_not_approved,
        success: false,
      });
    }

    const findRelaunch = await this.buyRelaunchRepository.findByBuy(buy.id);

    if (findRelaunch) {
      throw new ConflictException({
        message: MessageService.Buy_not_relaunch_exists,
        id: findRelaunch.novo_id_compra,
        success: false,
      });
    }

    const itensSelect = buy.item.filter((value) => {
      if (
        value.quotationItem.length > 0
          ? value.quotationItem.some((quotation) =>
              quotation.quotationSelected.length > 0 ? false : true,
            )
          : true
      ) {
        return true;
      } else {
        return false;
      }
    });

    const itemWithinQuantity = [];

    buy.item.forEach((item) => {
      const itemQuotation = item.quotationItem.find((quotation) =>
        quotation.quotationSelected.some((value) => value.aprovado === 1),
      );

      if (!itemQuotation || !itemQuotation.quantidade) return;

      if (item.quantidade !== itemQuotation.quantidade) {
        const newItem = item;
        newItem.quantidade = item.quantidade - itemQuotation.quantidade;
        itemWithinQuantity.push(newItem);
      }
    });

    const allItems = itensSelect
      .concat(itemWithinQuantity)
      .sort((item) => item.sequencia - item.sequencia);

    const newBuy = await this.buyRepository.create({
      id_cliente: user.clientId,
      id_filial: buy.branch.ID,
      log_user: user.login,
      observacao: buy.observacao,
      item: {
        createMany: {
          data: allItems.map((item) => {
            return {
              id_material: item.material.id || null,
              id_material_secundario: item?.materialSecond?.id || null,
              id_prioridade: item.priority.id,
              quantidade: item.quantidade,
              sequencia: item.sequencia,
              id_composicao_item: item?.compositionItem?.id || null,
              id_equipamento: item?.equipment?.ID || null,
              id_os: item?.serviceOrder?.ID || null,
              vinculo: item.vinculo,
            };
          }),
        },
      },
    });

    await this.buyRelaunchRepository.create({
      id_compra: buy.id,
      novo_id_compra: newBuy.id,
    });

    return {
      id: newBuy.id,
      success: true,
    };
  }
}
