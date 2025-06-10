import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateBody } from './dtos/create-body';
import ProductionCategoryDiverseRepository from 'src/repositories/production-category-diverse-repository';
import { IUserInfo } from 'src/models/IUser';
import { UpdateBody } from './dtos/update-body';
import { BranchRepository } from 'src/repositories/branch-repository';
import { ProductionCategoryItemsRepository } from 'src/repositories/production-category-items-repository';
import InsertItemBody from './dtos/insertItem-body';
import { MessageService } from 'src/service/message.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Smart List - Diverse')
@ApiBearerAuth()
@Controller('/smart-list/diverse')
export class DiverseController {
  constructor(
    private categoryDiverseRepository: ProductionCategoryDiverseRepository,
    private branchRepository: BranchRepository,
    private categoryItemsRepository: ProductionCategoryItemsRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async listAll(@Request() req) {
    const user: IUserInfo = req.user;

    const data = await this.categoryDiverseRepository.listByClient(
      user.clientId,
    );

    return (
      data.map((category) => ({
        id: category.id,
        name: category.nome,
        branch: category.branch.ID,
      })) || []
    );
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async insert(@Request() req, @Body() body: CreateBody) {
    const user: IUserInfo = req.user;
    try {
      const categoryDiverse = await this.categoryDiverseRepository.create({
        id_cliente: user.clientId,
        id_filial: body.branch,
        nome: body.name,
        log_user: user.login,
      });

      return {
        inserted: true,
        categoryDiverse,
      };
    } catch (err) {
      return {
        message: 'Não foi possível criar a categoria',
        erro: err,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: UpdateBody,
  ) {
    const categoryDiverse = await this.categoryDiverseRepository.update(
      Number(id),
      {
        nome: body.name,
      },
    );

    return categoryDiverse;
  }

  @UseGuards(AuthGuard)
  @Get('/list-branches')
  async listBranches(@Request() req) {
    const user: IUserInfo = req.user;

    const allBranch = [];

    for await (const branchId of user.branches) {
      const branch = await this.branchRepository.findById(branchId);

      allBranch.push({
        id: branch.ID,
        name: branch.filial_numero,
      });
    }

    return allBranch;
  }

  @UseGuards(AuthGuard)
  @Get('/:id/items')
  async listItems(@Param('id') id: string) {
    const items = await this.categoryItemsRepository.listByDiverse(Number(id));

    return items.map((item) => {
      return {
        id: item.id,
        name: item.nome,
      };
    });
  }

  @UseGuards(AuthGuard)
  @Post('/:id/items')
  async insertItem(@Param('id') id: string, @Body() body: InsertItemBody) {
    const categoryDiverse = await this.categoryDiverseRepository.findById(
      Number(id),
    );

    if (!categoryDiverse) {
      throw new NotFoundException(MessageService.Diverse_id_not_found);
    }

    const item = await this.categoryItemsRepository.create({
      id_diverso: categoryDiverse.id,
      nome: body.name,
    });

    return {
      id: item.id,
      name: item.nome,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/items/:itemId')
  async updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: UpdateBody,
  ) {
    const categoryDiverse = await this.categoryDiverseRepository.findById(
      Number(id),
    );

    if (!categoryDiverse) {
      throw new NotFoundException(MessageService.Diverse_id_not_found);
    }

    const item = await this.categoryItemsRepository.update(Number(itemId), {
      nome: body.name,
    });

    return {
      id: item.id,
      name: item.nome,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/items/:itemId')
  async deleteItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    const categoryDiverse = await this.categoryDiverseRepository.findById(
      Number(id),
    );

    if (!categoryDiverse) {
      throw new NotFoundException(MessageService.Diverse_id_not_found);
    }

    await this.categoryItemsRepository.delete(Number(itemId));

    return true;
  }
}
