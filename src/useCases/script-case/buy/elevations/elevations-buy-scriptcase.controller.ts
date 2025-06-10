import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import CreateItemBody from './dtos/create-elevations-body';
import UpdateItemBody from './dtos/update-elevations-body';

import { BranchRepository } from 'src/repositories/branch-repository';
import BuyElevationsRepository from 'src/repositories/buy-elevations-repository';
import { z } from 'zod';
import { MessageService } from 'src/service/message.service';
import ElevationRepository from 'src/repositories/elevation-repository';
import { ApiTags } from '@nestjs/swagger';
import BuyApprobationRepository from 'src/repositories/buy-approbation-repository';

@ApiTags('Script Case - Buy - Elevations')
@Controller('/script-case/buy/elevations')
export default class BuyElevationsController {
  constructor(
    private elevationRepository: ElevationRepository,
    private buyElevationsRepository: BuyElevationsRepository,
    private branchRepository: BranchRepository,
    private buyApprobationRepository: BuyApprobationRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getFilialElevations(@Req() req) {
    const user: IUserInfo = req.user;

    const querSchema = z.object({
      branchId: z.array(z.coerce.number()).optional().nullable(),
    });

    const query = querSchema.parse(req.query);

    const elevations = await this.buyElevationsRepository.listByBranches(
      query.branchId ? query.branchId : user.branches,
    );

    const response = [];

    elevations.forEach((elevation) => {
      const findIndex = response.findIndex(
        (value) => value.id === elevation.branch.ID,
      );

      if (findIndex < 0) {
        response.push({
          id: elevation.branch.ID,
          name: elevation.branch.filial_numero,
        });
      }
    });

    return response;
  }

  @UseGuards(AuthGuard)
  @Post('/:id/limit')
  async createLimitElevations(
    @Req() req,
    @Param('id') id: string,
    @Body() body: CreateItemBody,
  ) {
    const branch = await this.branchRepository.findById(Number(id));

    if (!Number(id)) {
      throw new BadRequestException('ID da filial inválido');
    }

    const user: IUserInfo = req.user;

    const elevations = await this.buyElevationsRepository.create({
      id_cliente: user.clientId,
      id_filial: branch.ID,
      limite_valor: body.limit,
      num_fornecedores: body.quantityProvider,
      num_aprovadores: body.quantityApprobation,
      justificativa: body.justify,
      urgente: body.emergency,
    });

    return elevations;
  }

  @UseGuards(AuthGuard)
  @Get('/:id/limit')
  async listElevations(@Param('id') id: string) {
    const data = await this.buyElevationsRepository.listElevations(Number(id));

    const response = data.map((elevations) => ({
      id: elevations.id,
      limit: Number(elevations.limite_valor),
      quantityProvider: elevations.num_fornecedores,
      quantityApproved: elevations.num_aprovadores,
      justify: elevations.justificativa,
      emergency: elevations.urgente,
    }));

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Put(':id/limit/:limitId')
  async updateElevations(
    @Req() req,
    @Param('limitId') limitId: number,
    @Body() body: UpdateItemBody,
  ) {
    const elevations = await this.buyElevationsRepository.update(
      Number(limitId),
      {
        limite_valor: body.limit,
        num_fornecedores: body.quantityProvider,
        num_aprovadores: body.quantityApprobation,
        justificativa: body.justify,
        urgente: body.emergency,
      },
    );

    return elevations;
  }

  @UseGuards(AuthGuard)
  @Delete(':id/limit/:limitId')
  async deleteElevations(@Req() req, @Param('limitId') limitId: number) {
    const deleted = await this.buyElevationsRepository.delete(Number(limitId));

    return deleted;
  }

  @UseGuards(AuthGuard)
  @Get('/:id/find-user-by-id')
  async getFilialElevationsById(@Req() req, @Param('id') branch_id: string) {
    const user: IUserInfo = req.user;

    if (!user.branch) {
      throw new BadRequestException('Usuário não possui branch valido.');
    }

    const elevations = await this.buyElevationsRepository.listByBranch(
      Number(branch_id),
    );

    const response = elevations.map((elevations) => {
      if (elevations.user) {
        return {
          id: elevations.id,
          login: elevations.user.login,
          name: elevations.user.name,
          level: elevations.nivel,
          status: elevations.status_aprovador,
        };
      }
    });

    return { data: response };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/user/:userId')
  async deleteUser(
    @Req() req,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const querySchema = z.object({ moduleId: z.coerce.number() });

    const query = querySchema.parse(req.query);

    const elevation = await this.elevationRepository.findById(Number(userId));

    if (!elevation) {
      throw new BadRequestException(MessageService.Elevation_not_found);
    }

    const listApprobationOpen =
      await this.buyApprobationRepository.listByUserAndOpen(
        elevation.user.login,
      );

    if (listApprobationOpen.length > 0) {
      throw new BadRequestException(
        MessageService.Elevation_user_not_deleted_bound_approbation,
      );
    }

    const totalApprobation =
      await this.elevationRepository.listByBranchAndModule(
        Number(id),
        query.moduleId,
      );

    const allLimit = await this.buyElevationsRepository.listElevations(
      Number(id),
    );

    let quantityApprobationRequired = 0;

    const findQuantityApprobationNotFill = allLimit.some((value) => {
      if (value.num_aprovadores > totalApprobation.length - 1) {
        quantityApprobationRequired = value.num_aprovadores;
        return true;
      }
    });

    if (findQuantityApprobationNotFill) {
      throw new ConflictException(
        MessageService.Elevation_user_not_deleted_not_approbation_in_branch +
          ' Sao Necessários: ' +
          quantityApprobationRequired +
          ' Aprovadores',
      );
    }

    await this.elevationRepository.delete(elevation.id);

    return {
      deleted: true,
    };
  }
}
