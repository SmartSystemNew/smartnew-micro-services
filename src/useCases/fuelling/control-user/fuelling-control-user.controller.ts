import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { FuellingControlUserRepository } from 'src/repositories/fuelling-control-user-repository';
import listTableControlUserResponseSwagger from './dtos/swagger/listTableControlUser-response-swagger';
import CreateControlUserBody from './dtos/createControlUser-body';
import InsertedResponseSwagger from 'src/models/swagger/inserted-response';
import { MessageService } from 'src/service/message.service';
import FuellingTrainRepository from 'src/repositories/fuelling-train-repository';
import { UserRepository } from 'src/repositories/user-repository';
import CreateControlUserBodySwagger from './dtos/swagger/createControlUser-body-swagger';
import UpdatedResponseSwagger from 'src/models/swagger/updated-response';
import DeletedResponseSwagger from 'src/models/swagger/delete-response';
import { FuellingRepository } from 'src/repositories/fuelling-repository';
import UpdatedControlUserBody from './dtos/updateControlUser-body';
import UpdatedControlUserBodySwagger from './dtos/swagger/updateControlUser-body-swagger';

@ApiTags('Fuelling - Control User')
@ApiBearerAuth()
@Controller('/fuelling/control-user')
export default class FuellingControlUserController {
  constructor(
    private fuellingControlUserRepository: FuellingControlUserRepository,
    private trainRepository: FuellingTrainRepository,
    private userRepository: UserRepository,
    private fuellingRepository: FuellingRepository,
  ) {}

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
    type: listTableControlUserResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/')
  async listTable(@Req() req) {
    const user: IUserInfo = req.user;

    const allControlUser =
      await this.fuellingControlUserRepository.listByClient(user.clientId);

    const response = allControlUser.map((control) => {
      return {
        id: control.id,
        branch: {
          value: control.branch.ID.toString(),
          label: control.branch.filial_numero,
        },
        user: {
          value: control.user.login,
          label: control.user.name,
        },
        type:
          control.motorista === 1
            ? {
                value: 'driver',
                label: 'Motorista',
              }
            : {
                value: 'supplier',
                label: 'Abastecedor',
              },
        password: control.codigo,
        train: control.train
          ? {
              value: control.train.id,
              label: `${control.train.tag} - ${control.train.placa}`,
            }
          : null,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: UpdatedControlUserBodySwagger,
  })
  @ApiOkResponse({
    description: 'Success',
    type: InsertedResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('/')
  async createControlUser(@Req() req, @Body() body: CreateControlUserBody) {
    const user: IUserInfo = req.user;

    const branch = user.branch.find((b) => b.id === body.branchId);

    if (!branch) {
      throw new ForbiddenException(MessageService.Branch_not_found);
    }

    const userFind = await this.userRepository.findByLogin(body.user);

    if (!userFind) {
      throw new ForbiddenException(MessageService.User_not_found);
    }

    let trainId = null;

    if (body.type === 'supplier') {
      const train = await this.trainRepository.findById(body.trainId);

      if (!train) {
        throw new ForbiddenException(MessageService.Fuelling_train_not_found);
      }

      trainId = train.id;
    }

    const controlUserExist =
      await this.fuellingControlUserRepository.findByLogin(userFind.login);

    if (controlUserExist) {
      throw new ConflictException(MessageService.Fuelling_user_duplicate);
    }

    await this.fuellingControlUserRepository.create({
      id_cliente: user.clientId,
      id_filial: branch.id,
      motorista: body.type === 'driver' ? 1 : 0,
      abastecedor: body.type === 'supplier' ? 1 : 0,
      codigo: body.password,
      id_comboio: trainId,
      usuario: userFind.login,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateControlUserBodySwagger,
  })
  @ApiOkResponse({
    description: 'Success',
    type: UpdatedResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put('/:id')
  async updateControlUser(
    @Param('id') id: string,
    @Body() body: UpdatedControlUserBody,
  ) {
    const controlUser = await this.fuellingControlUserRepository.findById(
      Number(id),
    );

    if (!controlUser) {
      throw new ForbiddenException(
        MessageService.Fuelling_control_user_not_found,
      );
    }

    // const fuelling = await this.fuellingRepository.listByFilter(user.clientId, {
    //   ...(controlUser.motorista && {
    //     motorista: controlUser.user.login,
    //   }),
    //   ...(controlUser.abastecedor && {
    //     abastecedor: controlUser.user.login,
    //   }),
    // });

    // if (fuelling.length > 0) {
    //   throw new ForbiddenException(
    //     MessageService.Fuelling_user_cannot_be_updated,
    //   );
    // }

    await this.fuellingControlUserRepository.update(controlUser.id, {
      id_filial: body.branchId,
      motorista: body.type === 'driver' ? 1 : 0,
      abastecedor: body.type === 'supplier' ? 1 : 0,
      codigo: body.password,
      id_comboio: body.trainId,
      usuario: body.user,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
    type: DeletedResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete('/:id')
  async deleteControlUser(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const controlUser = await this.fuellingControlUserRepository.findById(
      Number(id),
    );

    if (!controlUser) {
      throw new ForbiddenException(
        MessageService.Fuelling_control_user_not_found,
      );
    }

    const fuelling = await this.fuellingRepository.listByFilter(user.clientId, {
      ...(controlUser.motorista && {
        motorista: controlUser.user.login,
      }),
      ...(controlUser.abastecedor && {
        abastecedor: controlUser.user.login,
      }),
    });

    if (fuelling.length > 0) {
      throw new ForbiddenException(
        MessageService.Fuelling_user_cannot_be_deleted,
      );
    }

    await this.fuellingControlUserRepository.delete(controlUser.id);

    return {
      deleted: true,
    };
  }
}
