import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import BuyApprobationRepository from 'src/repositories/buy-approbation-repository';
import BuyQuotationItemRepository from 'src/repositories/buy-quotation-item-repository';
import BuyQuotationRepository from 'src/repositories/buy-quotation-repository';
import BuyQuotationSelectedRepository from 'src/repositories/buy-quotation-selected-repository';
import BuyRepository from 'src/repositories/buy-repository';
import ElevationRepository from 'src/repositories/elevation-repository';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
import saveSelectedBody from './dtos/saveSelected-body';
import BuyElevationsRepository from 'src/repositories/buy-elevations-repository';

@ApiTags('Script Case - Buy - Control Quotation')
@Controller('/script-case/buy/control-quotation')
export default class ControlQuotationController {
  constructor(
    private buyRepository: BuyRepository,
    private buyQuotationRepository: BuyQuotationRepository,
    private buyQuotationSelectedRepository: BuyQuotationSelectedRepository,
    private buyQuotationItemRepository: BuyQuotationItemRepository,
    private elevationRepository: ElevationRepository,
    private buyApprobationRepository: BuyApprobationRepository,
    private buyElevationsRepository: BuyElevationsRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async listTable(@Req() req) {
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
      filterPriority: z
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
      dateFrom: z
        .string()
        .transform(
          (value) =>
            (value === '' ? null : new Date(value)).toISOString().split('T')[0],
        )
        .optional(),
      dateTo: z
        .string()
        .transform((value) =>
          value === '' ? null : new Date(value).toISOString().split('T')[0],
        )
        .optional(),
      status: z
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
    });

    const query = querySchema.parse(req.query);
    //console.log(query);

    // const filterText = {};

    const conditions = [];

    conditions.push('scs.id not in (1,2,8,10,11,12)');

    if (query.globalFilter && query.globalFilter.length > 0) {
      conditions.push(` ( s.numero like '%${query.globalFilter}%'
          or b.filial_numero like '%${query.globalFilter}%'
          or scs.descricao like '%${query.globalFilter}%'
          or u.name like '%${query.globalFilter}%'
          or s.observacao like '%${query.globalFilter}%'
        ) `);
    }

    if (query.filterColumn) {
      switch (query.filterColumn) {
        case 'code':
          // filterText = {
          //   numero: {
          //     equals: Number(query.filterText),
          //   },
          // };
          conditions.push(`s.numero like '%${query.filterText}%'`);
          break;
        case 'company':
          // filterText = {
          //   branch: {
          //     filial_numero: {
          //       contains: query.filterText,
          //     },
          //   },
          // };
          conditions.push(`b.filial_numero like '%${query.filterText}%'`);
          break;
        case 'status':
          // filterText = {
          //   buyStatus: {
          //     descricao: {
          //       contains: query.filterText,
          //     },
          //   },
          // };
          conditions.push(`scs.descricao like '%${query.filterText}%'`);
          break;
        case 'date':
          if (query.dateFrom && query.dateTo) {
            // filterText = {
            //   logBuy: {
            //     log_date: {
            //       gte: query.dateFrom,
            //       lte: query.dateTo,
            //     },
            //   },
            // };
            conditions.push(
              `s.log_date BETWEEN '${query.dateFrom}' AND '${query.dateTo}'`,
            );
          }
          break;
        case 'user':
          // filterText = {
          //   user: {
          //     name: {
          //       contains: query.filterText,
          //     },
          //   },
          // };
          conditions.push(`u.name like '%${query.filterText}%'`);
          break;
        case 'observation':
          // filterText = {
          //   observacao: {
          //     contains: query.filterText,
          //   },
          // };
          conditions.push(`s.observacao like '%${query.filterText}%'`);
          break;
      }
    }

    if (query.filterPriority) {
      conditions.push(`scp.id IN (${query.filterPriority.join(',')})`);
    }

    const [allNewControlQuotation, newTotalItem] = await Promise.all([
      this.buyRepository.listByClientAndFilterRaw(
        user.clientId,
        query.page,
        query.perPage,
        conditions.length > 1 ? conditions.join(' AND ') : conditions[0],
      ),
      this.buyRepository.countListByClientAndFilterRaw(
        user.clientId,
        conditions.length > 1 ? conditions.join(' AND ') : conditions[0],
      ),
    ]);

    // const totalItems = await this.buyRepository.listByClientAndFilter(
    //   user.clientId,
    //   null,
    //   null,
    //   {
    //     status: {
    //       notIn: [1, 2, 8],
    //     },
    //   },
    // );

    // const response = allControlQuotation.map((control) => {
    //   return {
    //     code: control.numero.toString().padStart(6, '0'),
    //     company: control.branch.filial_numero,
    //     date: control.logBuy.length
    //       ? control.logBuy[0].log_date
    //       : control.log_date,
    //     id: control.id,
    //     observation: control.observacao,
    //     quantity_itens: control.item.length,
    //     status: control.buyStatus.descricao,
    //     total: control.item.reduce((acc, item) => {
    //       return (
    //         acc +
    //         item.quotationItem.reduce((subAcc, quotation) => {
    //           // Somar apenas se quotationSelected não estiver vazio
    //           if (quotation.quotationSelected.length > 0) {
    //             return subAcc + quotation.quantidade * quotation.valor;
    //           }
    //           return subAcc;
    //         }, 0)
    //       );
    //     }, 0),
    //     user: control?.user?.name || '',
    //   };
    // });

    //console.log(allNewControlQuotation);

    const response = allNewControlQuotation.map((control) => {
      return {
        code: control.numero.toString().padStart(6, '0'),
        company: control.branch.filial_numero,
        date: control.logBuy.length
          ? control.logBuy[0].log_date
          : control.log_date,
        id: control.id,
        observation: control.observacao,
        quantity_itens: control.quantity_itens,
        status: control.buyStatus.descricao,
        // priority: {
        //   id: control.priority.id,
        //   name: control.priority.name,
        // },
        total: control.total,
        user: control?.user?.name || '',
      };
    });

    return {
      success: true,
      data: response,
      totalItems: newTotalItem,
      //totalItems.length,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:buyId')
  async editStatus(@Param('buyId') buyNumber: number) {
    const buy = await this.buyRepository.findById(Number(buyNumber));

    if (!buy) {
      throw new NotFoundException('Não existe essa solicitação de compra');
    }

    if (buy.buyStatus.id < 3) {
      throw new ConflictException(
        MessageService.Buy_status_return_not_control_quotation,
      );
    } else if (buy.buyStatus.id > 3 && buy.buyStatus.id !== 9) {
      throw new BadRequestException(MessageService.Buy_status_not_allowed);
    }

    if (buy.buyStatus.id === 3) {
      const updateBuy = await this.buyRepository.update(buy.id, {
        status: 2,
      });

      return {
        message: 'Solicitação reaberta',
        data: updateBuy,
      };
    } else if (buy.buyStatus.id === 9) {
      const updateBuy = await this.buyRepository.update(buy.id, {
        status: 2,
      });

      return {
        message: 'Solicitação reaberta',
        data: updateBuy,
      };
    }

    return {
      message: 'Erro Interno, contate o suporte!',
      error: true,
      //data: updateBuy,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId')
  async findById(@Req() req) {
    const user: IUserInfo = req.user;
    const buy = await this.buyRepository.findById(Number(req.params.buyId));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    const response = {
      code: buy.numero.toString().padStart(6, '0'),
      requester: buy.user.name,
      boundFinance: user.module.findIndex((value) => value.id === 11) >= 0,
    };

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/find-provider')
  async findProvider(@Req() req, @Param('buyId') buyId: string) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    const querySchema = z.object({
      mode: z.coerce
        .string()
        .transform((value) =>
          value === ''
            ? null
            : value === 'more-expansive'
            ? 'more-expansive'
            : value === 'more-cheap'
            ? 'more-cheap'
            : null,
        )
        .optional(),
    });

    const query = querySchema.parse(req.query);

    //console.log(query);

    const allQuotation = await this.buyQuotationRepository.listByBuy(buy.id);

    const response = [];

    let control = [];

    allQuotation.forEach((quotation) => {
      let totalGross = 0;

      const items = quotation.quotationItem.map((item) => {
        totalGross += item.quantidade * item.valor;

        return {
          id: item.id,
          itemId: item.item.id,
          sequency: item.item.sequencia,
          material: `${item.item.material.codigo}-${item.item.material.material}`,
          bound:
            item.item.vinculo === 'equipment'
              ? `${item.item.equipment.equipamento_codigo}-${item.item.equipment.descricao}`
              : item.item.vinculo === 'os'
              ? `${item.item.serviceOrder.ordem}|${item.item.serviceOrder.equipment.equipamento_codigo}-${item.item.serviceOrder.equipment.descricao}`
              : item.item.vinculo === 'stock'
              ? 'ESTOQUE'
              : null,
          composition: item.item.compositionItem
            ? `${item.item.compositionItem.composicao}-${item.item.compositionItem.descricao}`
            : null,
          observation: item.observacao,
          quantity: item.quantidade,
          price: item.valor,
          total: item.quantidade * item.valor,
        };
      });

      control.push(
        ...items.map((value) => {
          return {
            id: value.id,
            itemId: value.itemId,
            total: value.total,
          };
        }),
      );

      const findDiscount = quotation.buy.buyQuotationDiscount.filter(
        (value) => value.provider.ID === quotation.provider.ID,
      );

      const totalAdditional = findDiscount.reduce((acc, current) => {
        if (current.tipo === 'ACRESCIMO') {
          return (acc += current.valor);
        } else {
          return (acc -= current.valor);
        }
      }, 0);

      response.push({
        id: quotation.id,
        providerId: quotation.provider.ID,
        provider: quotation.provider.nome_fantasia,
        comment: quotation.comentario,
        items,
        totalGross,
        totalAdditional,
        total: totalGross + totalAdditional,
      });
    });

    control = control.sort((a, b) => {
      if (query.mode === 'more-cheap') {
        return a.total - b.total; // Ordena do mais barato para o mais caro
      } else if (query.mode === 'more-expansive') {
        return b.total - a.total; // Ordena do mais caro para o mais barato
      }
      return 0;
    });

    const partial = buy.status === 7;

    const close = buy.status > 3;

    const approved =
      buy.buyApprobation.length > 0
        ? buy.buyApprobation.every((value) => value.aprovado === 1)
          ? 'approved'
          : buy.buyApprobation.every((value) => value.aprovado === 0)
          ? 'baned'
          : 'pending'
        : null;

    return {
      data: response,
      control,
      approved,
      close,
      partial,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:buyId/quotation/:quotationId/comment')
  async updateComment(@Req() req, @Param('quotationId') quotationId: string) {
    const bodySchema = z.object({
      comment: z.string(),
    });

    const body = bodySchema.parse(req.body);

    const quotation = await this.buyQuotationRepository.findById(
      Number(quotationId),
    );

    if (!quotation) {
      throw new NotFoundException(MessageService.Buy_quotation_id_not_found);
    }

    await this.buyQuotationRepository.update(quotation.id, {
      comentario: body.comment,
    });

    return {
      updated: true,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/find-selected')
  async findSelected(@Req() req, @Param('buyId') buyId: string) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    const allQuotationSelect =
      await this.buyQuotationSelectedRepository.listByBuy(buy.id);

    const response = allQuotationSelect.map((quotationSelect) => {
      return {
        id: quotationSelect.id,
        itemId: quotationSelect.quotationItem.item.id,
        sequency: quotationSelect.quotationItem.item.sequencia,
        material: quotationSelect.quotationItem.item.material.material,
        bound:
          quotationSelect.quotationItem.item.vinculo === 'equipment'
            ? `${quotationSelect.quotationItem.item.equipment.equipamento_codigo} - ${quotationSelect.quotationItem.item.equipment.descricao}`
            : quotationSelect.quotationItem.item.vinculo === 'os'
            ? `${quotationSelect.quotationItem.item.serviceOrder.ordem} | ${quotationSelect.quotationItem.item.serviceOrder.equipment.equipamento_codigo} - ${quotationSelect.quotationItem.item.serviceOrder.equipment.descricao}`
            : quotationSelect.quotationItem.item.vinculo === 'stock'
            ? 'ESTOQUE'
            : null,
        composition:
          quotationSelect.quotationItem.item?.compositionItem?.composicao ||
          null,
        provider:
          quotationSelect.quotationItem.quotation.provider.nome_fantasia,
        observation: quotationSelect.quotationItem.observacao,
        providerId: quotationSelect.quotationItem.quotation.provider.ID,
        quantity: quotationSelect.quotationItem.quantidade,
        price: quotationSelect.quotationItem.valor,
        total:
          quotationSelect.quotationItem.quantidade *
          quotationSelect.quotationItem.valor,
        approved: quotationSelect.aprovado === 1,
      };
    });

    return {
      data: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:buyId/save-selected')
  async saveSelected(
    @Param('buyId') buyId: string,
    @Body() body: saveSelectedBody,
  ) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    if (buy.status > 5 && buy.status !== 9) {
      throw new ForbiddenException({
        message: MessageService.Buy_status_not_allowed,
        success: false,
      });
    }

    if (body.items && body.items.length) {
      const allItemSelected =
        await this.buyQuotationSelectedRepository.listByBuy(buy.id);

      const quotationItemForCreate = body.items.filter(
        (value) =>
          allItemSelected.findIndex(
            (item) => item.quotationItem.id === Number(value),
          ) === -1,
      );

      const quotationItemForDelete = allItemSelected.filter(
        (item) =>
          body.items.findIndex(
            (value) => Number(value) === item.quotationItem.id,
          ) === -1,
      );

      // console.log(quotationItemForCreate);
      // console.log(quotationItemForDelete);

      for await (const quotationItem of quotationItemForCreate) {
        const findQuotationItem =
          await this.buyQuotationItemRepository.findById(Number(quotationItem));

        if (!findQuotationItem) {
          throw new NotFoundException({
            message: MessageService.Buy_quotation_item_not_found,
            success: false,
          });
        }

        await this.buyQuotationSelectedRepository.create({
          id_compra: buy.id,
          id_item_cotacao: findQuotationItem.id,
        });
      }

      for await (const quotationItem of quotationItemForDelete) {
        const findQuotationItem =
          await this.buyQuotationItemRepository.findById(
            quotationItem.quotationItem.id,
          );

        if (!findQuotationItem) {
          throw new NotFoundException({
            message: MessageService.Buy_quotation_item_not_found,
            success: false,
          });
        }

        await this.buyQuotationSelectedRepository.delete(quotationItem.id);
      }
    } else {
      await this.buyQuotationSelectedRepository.deleteByBuy(buy.id);
    }

    const allQuotationSelect =
      await this.buyQuotationSelectedRepository.listByBuy(buy.id);

    const response = allQuotationSelect.map((quotationSelect) => {
      return {
        id: quotationSelect.id,
        itemId: quotationSelect.quotationItem.item.id,
        sequency: quotationSelect.quotationItem.item.sequencia,
        material: quotationSelect.quotationItem.item.material.material,
        bound:
          quotationSelect.quotationItem.item.vinculo === 'equipment'
            ? `${quotationSelect.quotationItem.item.equipment.equipamento_codigo} - ${quotationSelect.quotationItem.item.equipment.descricao}`
            : quotationSelect.quotationItem.item.vinculo === 'os'
            ? `${quotationSelect.quotationItem.item.serviceOrder.ordem} | ${quotationSelect.quotationItem.item.serviceOrder.equipment.equipamento_codigo} - ${quotationSelect.quotationItem.item.serviceOrder.equipment.descricao}`
            : quotationSelect.quotationItem.item.vinculo === 'stock'
            ? 'ESTOQUE'
            : null,
        composition:
          quotationSelect.quotationItem.item?.compositionItem?.composicao ||
          null,
        provider:
          quotationSelect.quotationItem.quotation.provider.nome_fantasia,
        observation: quotationSelect.quotationItem.observacao,
        providerId: quotationSelect.quotationItem.quotation.provider.ID,
        quantity: quotationSelect.quotationItem.quantidade,
        price: quotationSelect.quotationItem.valor,
        total:
          quotationSelect.quotationItem.quantidade *
          quotationSelect.quotationItem.valor,
        approved: quotationSelect.aprovado === 1,
      };
    });

    return {
      data: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/responsible')
  async findResponsible(@Param('buyId') buyId: string) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    const allResponsible =
      await this.elevationRepository.listByBranchAndModuleAndBlankAndActive(
        buy.branch.ID,
        9,
        'blank_aprovacoes_cotacao',
      );

    const haveResponsible = allResponsible.length > 0;

    return {
      haveResponsible,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/check-item')
  async checkItem(@Param('buyId') buyId: string) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    const allItemSelected = await this.buyQuotationSelectedRepository.listByBuy(
      buy.id,
    );

    const countItem = buy.item.filter((value) => value.estoque !== 1).length;

    const countItemSelect = allItemSelected.length;

    let allQuoted = countItem === countItemSelect;

    for (const item of allItemSelected) {
      if (
        item.quotationItem.quantidade !== item.quotationItem.item.quantidade
      ) {
        allQuoted = false;
      }
    }

    return {
      allQuoted,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/finalize')
  async finalize(@Req() req, @Param('buyId') buyId: string) {
    const user: IUserInfo = req.user;

    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException({
        message: MessageService.Buy_id_not_found,
        success: false,
      });
    }

    if (buy.status > 5 && ![8, 9].includes(buy.status)) {
      throw new ForbiddenException({
        message: MessageService.Buy_status_not_allowed,
        success: false,
      });
    }

    if (buy.status === 8) {
      throw new ForbiddenException({
        message: MessageService.Buy_status_cancelled,
        success: false,
      });
    }

    const querySchema = z.object({
      partially: z
        .string()
        .transform((value) =>
          value === ''
            ? null
            : value === 'true'
            ? true
            : value === 'false'
            ? false
            : null,
        )
        .optional(),
    });

    const query = querySchema.parse(req.query);

    const itemQuotation =
      await this.buyQuotationItemRepository.listByBuyAndSelect(buy.id);

    itemQuotation.forEach((itemSelected) => {
      if (
        user.module.findIndex((value) => value.id === 11) >= 0 &&
        //item.estoque !== 1 &&
        itemSelected.item.compositionItem === null
      ) {
        throw new NotFoundException({
          message: MessageService.Buy_item_composition_not_found,
          success: false,
        });
      }
    });

    const allResponsible =
      await this.elevationRepository.listByBranchAndModuleAndBlankAndActive(
        buy.branch.ID,
        9,
        'blank_aprovacoes_cotacao',
      );

    if (allResponsible.length === 0) {
      throw new NotFoundException({
        message: MessageService.elevation_not_found,
        success: false,
      });
    }

    // Verificar Limite Aprovadores
    // Aqui estou calculando o total da cotação
    const limits = await this.buyElevationsRepository.listElevations(
      buy.branch.ID,
    );

    // ordenando limites por valor
    limits.sort(
      (a, b) =>
        parseFloat(a.limite_valor.toString()) -
        parseFloat(b.limite_valor.toString()),
    );

    let requiredApprobation = null;

    const biggerTotal = itemQuotation.reduce((acc, current) => {
      return (acc += current.quantidade * current.valor);
    }, 0);

    for (const limit of limits) {
      if (biggerTotal >= parseFloat(limit.limite_valor.toString())) {
        requiredApprobation = limit.num_aprovadores;
      }
    }

    const allItemInPrioritySkipApprobation = buy.item
      .filter((value) => value.estoque !== 1)
      .every((value) => value.priority.exige_fornecedor === 0);

    if (allItemInPrioritySkipApprobation) {
      const requestTransaction = await this.buyRepository.createRequest(
        user.clientId,
        buy.id,
        user.module.findIndex((mod) => mod.id === 11) >= 0,
        user.login,
      );

      if (requestTransaction.success) {
        return {
          success: true,
          message: requestTransaction.message,
        };
      } else {
        return { ...requestTransaction };
      }
    }

    if (requiredApprobation && allResponsible.length < requiredApprobation) {
      throw new BadRequestException({
        message: `Número insuficiente de aprovadores: necessário pelo menos ${requiredApprobation}, mas apenas ${allResponsible.length} foram encontrados.`,
        success: false,
      });
    }
    //const test = [];
    if (requiredApprobation) {
      for await (const responsible of allResponsible
        .sort((a, b) => a.nivel - b.nivel)
        .slice(0, requiredApprobation)) {
        // console.log('if');
        // test.push({
        //   id_compra: buy.id,
        //   aprovador: responsible.login,
        // });
        const validDuplicate =
          await this.buyApprobationRepository.findByBuyAndUser(
            buy.id,
            responsible.login,
          );
        if (!validDuplicate) {
          await this.buyApprobationRepository.create({
            id_compra: buy.id,
            aprovador: responsible.login,
          });
        } else {
          await this.buyApprobationRepository.update(validDuplicate.id, {
            assinatura: null,
            aprovado: null,
          });
        }
      }
    } else {
      for await (const responsible of allResponsible) {
        // console.log('else');
        // test.push({
        //   id_compra: buy.id,
        //   aprovador: responsible.login,
        // });
        const validDuplicate =
          await this.buyApprobationRepository.findByBuyAndUser(
            buy.id,
            responsible.login,
          );

        if (!validDuplicate) {
          await this.buyApprobationRepository.create({
            id_compra: buy.id,
            aprovador: responsible.login,
          });
        } else {
          await this.buyApprobationRepository.update(validDuplicate.id, {
            assinatura: null,
            aprovado: null,
          });
        }
      }
    }

    if (query.partially) {
      await this.buyRepository.update(buy.id, {
        status: 5,
        responsavel_fechamento: user.login,
        fechamento: new Date(),
      });
    } else {
      await this.buyRepository.update(buy.id, {
        status: 4,
        responsavel_fechamento: user.login,
        fechamento: new Date(),
      });
    }

    return {
      success: true,
    };
  }
}
