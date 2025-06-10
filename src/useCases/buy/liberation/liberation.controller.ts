import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import BuyRepository from 'src/repositories/buy-repository';
import BuyResponsibleRepository from 'src/repositories/buy-responsible-repository';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
import ListLiberationResponseSwagger from './dtos/swagger/listLiberation-response-swagger';
import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';

@ApiTags('Buy - Liberation')
@ApiBearerAuth()
@ApiOkResponse({ description: 'Success' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('buy/liberation')
export default class LiberationController {
  constructor(
    private buyRepository: BuyRepository,
    private buyResponsibleRepository: BuyResponsibleRepository,
    private materialEstoqueRepository: MaterialEstoqueRepository,
  ) {}

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListLiberationResponseSwagger,
  })
  @Get('/')
  async listLiberation(@Req() req) {
    const querySchema = z.object({
      page: z.coerce.number().optional().default(0),
      perPage: z.coerce.number().optional().default(10),
    });

    const query = querySchema.parse(req.query);

    const user: IUserInfo = req.user;

    const liberation = await this.buyResponsibleRepository.listBranchByUser(
      user.login,
    );

    if (liberation.length === 0) {
      throw new NotFoundException(MessageService.Buy_liberation_user_not_found);
    }

    const buyList = await this.buyRepository.listByClientAndFilterGrid(
      user.clientId,
      query.page,
      query.perPage,
      {
        AND: [
          {
            branch: {
              ID: {
                in: liberation.map((b) => b.id_filial),
              },
            },
            status: 11, // Aguardando Liberacao
          },
        ],
      },
    );

    const response = buyList.map((buy) => {
      return {
        id: buy.id,
        branch: buy.branch.filial_numero,
        emission:
          buy.logBuy.length >= 1 ? buy.logBuy[0].log_date : buy.log_date,
        number: buy.numero.toString().padStart(6, '0'),
        observation: buy.observacao,
        status: buy.buyStatus.descricao,
      };
    });

    return {
      response,
    };
  }

  @UseGuards(AuthGuard)
  // @ApiResponse({
  //   description: 'Success',
  //   type: ListLiberationResponseSwagger,
  // })
  @Put('/:id')
  async updateLiberation(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      status: z.number(),
    });

    const body = bodySchema.parse(req.body);

    const buy = await this.buyRepository.findById(Number(id));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    if (body.status) {
      let goReserve = false;

      for await (const item of buy.item) {
        if (item.estoque === 1 && item.materialSecond) {
          goReserve = true;
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
    } else {
      await this.buyRepository.update(Number(id), {
        status: 1, // Solicitado
      });
    }
  }
}
