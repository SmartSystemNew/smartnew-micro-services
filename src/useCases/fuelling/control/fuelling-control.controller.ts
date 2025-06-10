import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import FuellingControlRepository from 'src/repositories/fuelling-control-repository';
import CreateControlBody from './dtos/createControl-body';
import { MessageService } from 'src/service/message.service';
import CreateControlBodySwagger from './dtos/swagger/createControl-body.swagger';
import UpdatedResponseSwagger from 'src/models/swagger/updated-response';
import InsertedResponseSwagger from 'src/models/swagger/inserted-response';
import UpdateControlBody from './dtos/updateControl-body';

@ApiTags('Fuelling - Control')
@ApiBearerAuth()
@Controller('/fuelling/control')
export default class FuellingControlController {
  constructor(private fuellingControlRepository: FuellingControlRepository) {}
  @UseGuards(AuthGuard)
  @Get('/')
  async listControl(@Req() req) {
    const user: IUserInfo = req.user;

    const control = await this.fuellingControlRepository.listByClient(
      user.clientId,
    );

    let response: any = {};

    if (control) {
      response = {
        id: control.id,
        filterDay: control.filtro_dia,
        modelPU: control.modelo_PU,
        initialDate: control.inicio_controle,
      };
    }

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateControlBodySwagger })
  @ApiCreatedResponse({
    type: InsertedResponseSwagger,
  })
  @Post('/')
  async createControl(@Req() req, @Body() body: CreateControlBody) {
    const user: IUserInfo = req.user;

    const control = await this.fuellingControlRepository.listByClient(
      user.clientId,
    );

    if (control) {
      await this.fuellingControlRepository.update(control.id, {
        filtro_dia: body.filterDay,
        modelo_PU: body.modelPU,
        inicio_controle: body.modelPU ? new Date() : null,
      });
    } else {
      await this.fuellingControlRepository.create({
        id_cliente: user.clientId,
        filtro_dia: body.filterDay,
        modelo_PU: body.modelPU,
        inicio_controle: body.modelPU ? new Date() : null,
      });
    }

    return {
      created: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateControlBodySwagger })
  @ApiResponse({
    type: UpdatedResponseSwagger,
  })
  @Put('/:id')
  async updateControl(
    @Param('id') id: string,
    @Body() body: UpdateControlBody,
  ) {
    const control = await this.fuellingControlRepository.findById(Number(id));

    if (!control) {
      throw new NotFoundException(MessageService.Fuelling_control_not_found);
    }

    await this.fuellingControlRepository.update(control.id, {
      filtro_dia: body.filterDay,
      modelo_PU: body.modelPU,
      inicio_controle: body.modelPU ? new Date() : null,
    });

    return {
      updated: true,
    };
  }
}
