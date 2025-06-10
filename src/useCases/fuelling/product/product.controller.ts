import {
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import FuellingProductRepository from 'src/repositories/fuelling-product-repository';
import CreateProductBody from './dtos/createProduct-body';
import { MessageService } from 'src/service/message.service';
import UpdateProductBody from './dtos/updateProduct-body';
import { listTableProductSwaggerResponse } from './dtos/swagger/listTable-response-swagger';
import InsertedResponseSwagger from 'src/models/swagger/inserted-response';
import UpdatedResponseSwagger from 'src/models/swagger/updated-response';
import DeletedResponseSwagger from 'src/models/swagger/delete-response';
import { createProductBodySwagger } from './dtos/swagger/createProduct-body-swagger';
import { updateProductBodySwagger } from './dtos/swagger/updateProduct-body-swagger';
import { z } from 'zod';

@ApiTags('Fuelling - Product')
@ApiBearerAuth()
@Controller('/fuelling/product')
export default class ProductController {
  constructor(private fuellingProductRepository: FuellingProductRepository) {}

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
    type: listTableProductSwaggerResponse,
    example: [
      {
        id: 1,
        description: 'Gasolina',
        unity: 'Litro',
      },
    ],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/')
  async listTable(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      s: z.string().nullable().optional(),
    });

    const query = querySchema.parse(req.query);

    const allProducts = await this.fuellingProductRepository.listByClient(
      user.clientId,
      query.s && query.s.length > 0
        ? {
            OR: [
              {
                descricao: { contains: query.s },
              },
              {
                unidade: { contains: query.s },
              },
            ],
          }
        : null,
    );

    const response = allProducts.map((product) => {
      return {
        id: product.id,
        description: product.descricao,
        unity: product.unidade,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: createProductBodySwagger,
  })
  @ApiOkResponse({ description: 'Success', type: InsertedResponseSwagger })
  @Post('/')
  async createProduct(@Req() req, @Body() body: CreateProductBody) {
    const user: IUserInfo = req.user;

    const validDuplicate =
      await this.fuellingProductRepository.findByClientAndName(
        user.clientId,
        body.description,
      );

    if (validDuplicate) {
      throw new ConflictException(MessageService.Fuelling_product_duplicate);
    }

    await this.fuellingProductRepository.create({
      id_cliente: user.clientId,
      descricao: body.description,
      unidade: body.unity,
      log_user: user.login,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: updateProductBodySwagger,
  })
  @ApiOkResponse({ description: 'Success', type: UpdatedResponseSwagger })
  @Put('/:id')
  async update(
    @Req() req,
    @Body() body: UpdateProductBody,
    @Param('id') id: string,
  ) {
    const user: IUserInfo = req.user;

    const product = await this.fuellingProductRepository.findById(Number(id));

    if (!product) {
      throw new ConflictException(MessageService.Fuelling_fuel_not_found);
    }

    if (product.fuelling.length > 0) {
      throw new ConflictException(MessageService.Fuelling_product_not_edit);
    }

    await this.fuellingProductRepository.update(product.id, {
      id_cliente: user.clientId,
      descricao: body.description,
      unidade: body.unity,
      log_user: user.login,
    });

    return {
      update: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: DeletedResponseSwagger })
  @Delete('/:id')
  async delete(@Req() req, @Param('id') id: string) {
    const product = await this.fuellingProductRepository.findById(Number(id));

    if (!product) {
      throw new ConflictException(MessageService.Fuelling_fuel_not_found);
    }

    if (product.fuelling.length > 0) {
      throw new ConflictException(MessageService.Fuelling_product_not_delete);
    }

    await this.fuellingProductRepository.delete(product.id);

    return {
      delete: true,
    };
  }
}
