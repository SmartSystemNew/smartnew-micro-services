import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { FamilyRepository } from 'src/repositories/family-repository';
import { CreateBody } from './dtos/create-body';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Smart List - Family')
@ApiBearerAuth()
@Controller('/smart-list/family')
export class FamilyController {
  constructor(private familyRepository: FamilyRepository) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async listAll(@Request() req) {
    const { user } = req;

    const data = await this.familyRepository.listByClient(user.clientId);

    return (
      data?.map((family) => ({
        id: family.ID,
        clientId: family.ID_cliente,
        branchId: family.ID_filial,
        family: family.familia,
        observation: family.observacoes,
      })) || []
    );
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async createFamily(@Request() req, @Body() body: CreateBody) {
    const { user } = req;
    const { family, branchId } = body;

    try {
      const inserted = await this.familyRepository.insert({
        clientId: user.clientId,
        family,
        branchId,
      });

      return {
        inserted: true,
        id: inserted.ID,
        family: inserted.familia,
      };
    } catch (err) {
      return {
        message: 'Não foi possivel inserir a familia',
        erro: err,
      };
    }
  }
}
