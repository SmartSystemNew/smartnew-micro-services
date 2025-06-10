import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import LocationRepository from 'src/repositories/location-repository';
import CreateBody from './dtos/create-body';
import { MessageService } from 'src/service/message.service';
import UpdateBody from './dtos/update-body';
import { ListByBranchQuery } from './dtos/listByBranch-query';
import ChecklistCategoryDiverseRepository from 'src/repositories/checklist-category-diverse-repository';
import CreateCategoryBody from './dtos/createCategory-body';
import UpdateCategoryBody from './dtos/updateCategory-body';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Smart List - Location')
@ApiBearerAuth()
@Controller('/smart-list/location')
export class LocationController {
  constructor(
    private locationRepository: LocationRepository,
    private checklistCategoryDiverseRepository: ChecklistCategoryDiverseRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async listByBranch(@Req() req, @Query() query: ListByBranchQuery) {
    const user: IUserInfo = req.user;

    const allLocation = await this.locationRepository.findByBranch(
      user.branches,
      query.s && query.s !== null && query.s !== 'null'
        ? {
            AND: {
              OR: [
                {
                  tag: {
                    contains: query.s,
                  },
                },
                {
                  localizacao: {
                    contains: query.s,
                  },
                },
              ],
            },
          }
        : undefined,
    );

    const response = allLocation.map((location) => {
      return {
        value: location.id,
        tag: location.tag,
        text: location.localizacao,
        branch: {
          value: location.branch.ID,
          text: location.branch.filial_numero,
        },
        category: location.category
          ? {
              value: location.category.id,
              text: location.category.categoria,
            }
          : null,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Req() req, @Body() body: CreateBody) {
    const user: IUserInfo = req.user;

    if (body.tag) {
      const validLocation = await this.locationRepository.findByBranchAndTag(
        body.branchId,
        body.tag,
      );

      if (validLocation) {
        throw new ConflictException(MessageService.Location_already_exist);
      }
    }

    const location = await this.locationRepository.create({
      id_filial: body.branchId,
      id_categoria: body.categoryId ? Number(body.categoryId) : null,
      tag: body.tag,
      localizacao: body.description,
      log_user: user.login,
    });

    return {
      inserted: true,
      data: {
        value: location.id,
        tag: location.tag,
        text: location.localizacao,
        branch: {
          value: location.branch.ID,
          text: location.branch.filial_numero,
        },
        category: location.category
          ? {
              value: location.category.id.toString(),
              text: location.category.categoria,
            }
          : null,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateBody) {
    const location = await this.locationRepository.findById(Number(id));

    if (!location) {
      throw new NotFoundException(MessageService.Bound_location_not_found);
    }

    if (body.tag) {
      const validLocation = await this.locationRepository.findByBranchAndTag(
        location.branch.ID,
        body.tag,
      );

      if (validLocation && validLocation.id !== location.id) {
        throw new ConflictException(MessageService.Location_already_exist);
      }
    }

    await this.locationRepository.update(location.id, {
      id_categoria: body.categoryId ? Number(body.categoryId) : null,
      tag: body.tag,
      localizacao: body.description,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteByBranch(@Param('id') id: string) {
    const location = await this.locationRepository.findById(Number(id));

    if (!location) {
      throw new NotFoundException(MessageService.Bound_location_not_found);
    }

    if (location.checklist.length > 0 || location.modelChecklist.length > 0) {
      throw new ConflictException(MessageService.Location_not_delete);
    }

    await this.locationRepository.delete(location.id);

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/category')
  async listCategory(@Req() req) {
    const user: IUserInfo = req.user;

    const allCategory =
      await this.checklistCategoryDiverseRepository.listByClient(user.clientId);

    const response = allCategory.map((category) => {
      return {
        value: category.id.toString(),
        label: category.categoria,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/category')
  async createCategory(@Req() req, @Body() body: CreateCategoryBody) {
    const user: IUserInfo = req.user;

    await this.checklistCategoryDiverseRepository.create({
      id_cliente: user.clientId,
      categoria: body.category,
    });

    return { inserted: true };
  }

  @UseGuards(AuthGuard)
  @Get('/category/:id')
  async findCategory(@Param('id') id: string) {
    const category = await this.checklistCategoryDiverseRepository.findById(
      Number(id),
    );

    if (!category) {
      throw new NotFoundException(MessageService.Category_diverse_not_found);
    }

    return {
      data: {
        value: category.id.toString(),
        label: category.categoria,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Put('/category/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryBody,
  ) {
    const category = await this.checklistCategoryDiverseRepository.findById(
      Number(id),
    );

    if (!category) {
      throw new NotFoundException(MessageService.Category_diverse_not_found);
    }

    await this.checklistCategoryDiverseRepository.update(category.id, {
      categoria: body.category,
    });

    return { updated: true };
  }

  @UseGuards(AuthGuard)
  @Delete('/category/:id')
  async deleteCategory(@Param('id') id: string) {
    const category = await this.checklistCategoryDiverseRepository.findById(
      Number(id),
    );

    if (!category) {
      throw new NotFoundException(MessageService.Category_diverse_not_found);
    }

    await this.checklistCategoryDiverseRepository.delete(category.id);

    return { deleted: true };
  }
}
