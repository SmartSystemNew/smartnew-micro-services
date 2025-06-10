import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import ColaboratorRepository from 'src/repositories/colaborator-repository';
import ServiceOrderMaintainerRepository from 'src/repositories/service-order-maintainer-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { z } from 'zod';

@ApiTags('Maintenance - Maintainers')
@Controller('/maintenance/maintainers')
export default class MaintainersController {
  constructor(
    private serviceOrderRepository: ServiceOrderRepository,
    private colaboratorRepository: ColaboratorRepository,
    private ServiceOrderMaintainer: ServiceOrderMaintainerRepository,
  ) {}
  @UseGuards(AuthGuard)
  @Get('/')
  async ListMaintainers(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      index: z.coerce.number().optional().default(0),
      perPage: z.coerce.number().optional().default(10),
      branchId: z.array(z.coerce.number()).optional().nullable(),
      collaboratorId: z.array(z.coerce.number()).optional().nullable(),
      startDate: z.coerce.date().optional().nullable(),
      endDate: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const response = {};

    const allCollaborator = await this.colaboratorRepository.ListByClient(
      user.clientId,
      {
        ...(query.collaboratorId &&
          query.collaboratorId.length > 0 && {
            id: {
              in: query.collaboratorId,
            },
          }),
      },
    );

    for await (const collaborator of allCollaborator) {
      const allOrdersBranches =
        await this.serviceOrderRepository.listServiceOrder(
          query.branchId || user.branches,
          query.index,
          query.perPage,
          {
            data_hora_encerramento: null,
            maintainers: {
              some: {
                id_colaborador: collaborator.id,
              },
            },
            AND: [
              {
                ...(query.startDate && {
                  data_hora_solicitacao: {
                    gte: query.startDate,
                    lte: query.endDate || new Date(),
                  },
                }),
              },
            ],
          },
        );

      const totalItems =
        await this.serviceOrderRepository.countListServiceOrder(
          query.branchId || user.branches,
          {
            data_hora_encerramento: null,
            maintainers: {
              some: {
                id_colaborador: collaborator.id,
              },
            },
            AND: [
              {
                ...(query.startDate && {
                  data_hora_solicitacao: {
                    gte: query.startDate,
                    lte: query.endDate || new Date(),
                  },
                }),
              },
            ],
          },
        );

      response[collaborator.id] = {
        name: collaborator.nome,
        totalItems: totalItems,
        pageCount: Math.ceil(totalItems / query.perPage),
        items: allOrdersBranches.map((order) => ({
          ID: order.ID,
          ordem: order.ordem,
          equipment: order.equipment.descricao,
          description: order.descricao_solicitacao,
          typeMaintenance: order.typeMaintenance.tipo_manutencao,
          dateEmission: order.log_date,
          dataRequested: order.data_hora_solicitacao,
        })),
      };
    }

    //  else {
    //   const allCollaborator = await this.colaboratorRepository.ListByClient(
    //     user.clientId,
    //   );

    //   for await (const collaborator of allCollaborator) {
    //     const allOrdersBranches =
    //       await this.serviceOrderRepository.listServiceOrder(
    //         query.branchId || user.branches,
    //         null,
    //         null,
    //         {
    //           data_hora_encerramento: null,
    //           maintainers: {
    //             some: {
    //               id_colaborador: collaborator.id,
    //             },
    //           },
    //           AND: [
    //             {
    //               ...(query.startDate && {
    //                 data_hora_solicitacao: {
    //                   gte: query.startDate,
    //                   lte: query.endDate || new Date(),
    //                 },
    //               }),
    //             },
    //           ],
    //         },
    //       );

    //     response[collaborator.id] = {
    //       name: collaborator.nome,
    //       items: allOrdersBranches.map((order) => ({
    //         ID: order.ID,
    //         ordem: order.ordem,
    //         equipment: order.equipment.descricao,
    //         description: order.descricao_solicitacao,
    //         typeMaintenance: order.typeMaintenance.tipo_manutencao,
    //         dateEmission: order.log_date,
    //         dataRequested: order.data_hora_solicitacao,
    //       })),
    //     };
    //   }
    // }

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/orders')
  async listOrders(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      index: z.coerce.number().optional().default(0),
      perPage: z.coerce.number().optional().default(10),
    });

    const query = querySchema.parse(req.query);

    const totalOrder = await this.serviceOrderRepository.countListServiceOrder(
      user.branches,
      {
        maintainers: null,
      },
    );

    const allOrder = await this.serviceOrderRepository.listServiceOrder(
      user.branches,
      query.index,
      query.perPage,
      {
        maintainers: null,
      },
    );

    const response = allOrder.map((order) => {
      return {
        ID: order.ID,
        ordem: order.ordem,
        equipment: order.equipment.descricao,
        description: order.descricao_solicitacao,
        typeMaintenance: order.typeMaintenance.tipo_manutencao,
        dateEmission: order.log_date,
        dataRequested: order.data_hora_solicitacao,
      };
    });

    return {
      data: response,
      totalItens: totalOrder,
      pageCount: Math.ceil(totalOrder / query.perPage),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/summary')
  async getOrdersSummary(
    @Req() req,
  ): Promise<{ allocated: number; unallocated: number }> {
    const user: IUserInfo = req.user;

    const [allOrders] = await Promise.all([
      this.serviceOrderRepository.listByBranch(user.branches),
    ]);

    const filterOrdensAllocated = allOrders.filter(
      (order) =>
        order.data_hora_encerramento === null && order.maintainers.length === 0,
    );

    const { allocated, unallocated } = filterOrdensAllocated.reduce(
      (counts, order) => {
        if (order.mantenedores) {
          return { ...counts, allocated: counts.allocated + 1 };
        } else !order.mantenedores;
        return { ...counts, unallocated: counts.unallocated + 1 };
      },
      { allocated: 0, unallocated: 0 },
    );

    return { allocated, unallocated };
  }

  @UseGuards(AuthGuard)
  @Post('/redistribute')
  async redistributeOrders(
    @Req() req,
    @Body() body: { orders: number[]; collaboratorId: number },
  ): Promise<{ message: string }> {
    const { orders, collaboratorId } = body;
    const user: IUserInfo = req.user;

    const collaborator = await this.colaboratorRepository.findByIdAndClient(
      collaboratorId,
      user.clientId,
    );

    if (!collaborator) {
      throw new BadRequestException(
        `Colaborador ${collaboratorId} não encontrado ou não pertence ao cliente logado.`,
      );
    }

    const unassignedOrders =
      await this.serviceOrderRepository.findUnissgnedOrders(
        orders,
        user.clientId,
      );

    if (unassignedOrders.length === 0) {
      throw new BadRequestException(
        'Nenhuma ordem de serviço não atribuída encontrada para redistribuir.',
      );
    }

    await this.ServiceOrderMaintainer.createOrdersMaintainerInBulk(
      unassignedOrders.map((order) => order.ID),
      [collaboratorId],
    );

    return { message: 'Ordens de serviço redistribuídas com sucesso.' };
  }

  @UseGuards(AuthGuard)
  @Get('/filter-orders')
  async filterOrders(@Req() req): Promise<{ orders: any[]; branches: any[] }> {
    const user: IUserInfo = req.user;
    const { branch, startDate, endDate } = req.query;

    const allOrders = await this.serviceOrderRepository.listByClient(
      user.clientId,
    );

    const allBranches = allOrders.map((order) => order.branch).filter(Boolean);
    const uniqueBranches = Array.from(
      new Map(allBranches.map((branch) => [branch.ID, branch])).values(),
    );

    const filteredByBranch = branch
      ? allOrders.filter((order) => order.branch?.filial_numero === branch)
      : allOrders;

    const filteredByDate =
      startDate && endDate
        ? filteredByBranch.filter((order) => {
            const orderDate = new Date(order.log_date);
            return (
              orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
            );
          })
        : filteredByBranch;

    const orders = filteredByDate.map((order) => ({
      ID: order.ID,
      ordem: order.ordem,
      branch: order.branch
        ? {
            ID: order.branch.ID,
            filial_numero: order.branch.filial_numero,
            razao_social: order.branch.razao_social,
          }
        : null,
      equipment: order.equipment?.descricao || 'N/A',
      description: order.descricao_solicitacao,
      dateEmission: order.log_date || null,
      openTime: order.data_prevista_termino || null,
    }));

    return {
      orders,
      branches: uniqueBranches.map((branch) => ({
        ID: branch.ID,
        razao_social: branch.razao_social,
        filial_numero: branch.filial_numero,
      })),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-maintainer')
  async listCollaboratorsWithHours(@Req() req): Promise<any[]> {
    const user: IUserInfo = req.user;

    const allCollaborators = await this.colaboratorRepository.ListByClient(
      user.clientId,
    );

    const result = await Promise.all(
      allCollaborators.map(async (colaborator) => {
        const orders = await this.serviceOrderRepository.listByMaintenairs(
          user.clientId,
          user.branches,
          colaborator.id,
        );

        const { totalhrsPrevis, totalhrsExecu } = orders.reduce(
          (acc, order) => {
            const startDate = new Date(order.log_date);
            const endDate = order.data_prevista_termino
              ? new Date(order.data_prevista_termino)
              : null;

            const hrsPrevista = endDate
              ? Math.max(
                  (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
                  0,
                )
              : 0;

            const hrsExecucao = Math.max(
              (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60),
              0,
            );

            acc.totalhrsPrevis += hrsPrevista;
            acc.totalhrsExecu += hrsExecucao;
            return acc;
          },
          { totalhrsPrevis: 0, totalhrsExecu: 0 },
        );

        return {
          id: colaborator.id,
          colaborador: colaborator.nome,
          totalhrsPrevis: `${totalhrsPrevis.toFixed(2)}hrs`,
          totalhrsExecu: `${totalhrsExecu.toFixed(2)}hrs`,
        };
      }),
    );

    return result;
  }
}
