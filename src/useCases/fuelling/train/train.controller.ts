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
import FuellingTrainRepository from 'src/repositories/fuelling-train-repository';
import { InsertTrainBody } from './dtos/insertTrain-body';
import { BranchRepository } from 'src/repositories/branch-repository';
import { MessageService } from 'src/service/message.service';
import { UpdateTrainBody } from './dtos/updateTrain-body';
import FuellingTrainCompartmentRepository from 'src/repositories/fuelling-train-compartment-repository';
import { InsertCompartmentBody } from './dtos/insertCompartment-body';
import { FuelRepository } from 'src/repositories/fuel-repository';
import { UpdateCompartmentBody } from './dtos/updateCompartment-body';
import { z } from 'zod';
import ListTrainQuery from './dtos/listTrain-query';
import { ApiTags } from '@nestjs/swagger';
import FuellingControlRepository from 'src/repositories/fuelling-control-repository';

@ApiTags('Fuelling - Train')
@Controller('fuelling/train')
export default class TrainController {
  constructor(
    private trainRepository: FuellingTrainRepository,
    private branchRepository: BranchRepository,
    private trainCompartmentRepository: FuellingTrainCompartmentRepository,
    private fuelRepository: FuelRepository,
    private fuelingControlRepository: FuellingControlRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async listTrain(@Req() req, @Query() queryParams) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      s: z.coerce.string().optional(),
    });

    const query: ListTrainQuery = querySchema.parse(queryParams);

    const allTrain = await this.trainRepository.listByBranches(
      user.branches,
      query.s && {
        OR: [
          {
            tag: {
              contains: query.s,
            },
          },
          {
            placa: {
              contains: query.s,
            },
          },
          {
            branch: {
              filial_numero: {
                contains: query.s,
              },
            },
          },
          {
            trainFuel: {
              some: {
                fuel: {
                  descricao: {
                    contains: query.s,
                  },
                },
              },
            },
          },
        ],
      },
    );

    const control = await this.fuelingControlRepository.listByClient(
      user.clientId,
    );

    const response = allTrain.map((train) => {
      return {
        id: train.id,
        tag: train.tag,
        train: train.placa,
        capacity: train.capacidade,
        compartment: train.trainFuel
          .map((compartment) => compartment.fuel.descricao)
          .join(','),
        compartmentAll: train.trainFuel.map((item) => {
          const quantity =
            item.inputProduct.reduce((acc, current) => {
              return acc + current.quantidade;
            }, 0) -
            item.fuelling.reduce((acc, current) => {
              return acc + Number(current.quantidade);
            }, 0);

          const lastInput =
            item.inputProduct.length > 0
              ? item.inputProduct.sort(
                  (a, b) => b.input.data.getTime() - a.input.data.getTime(),
                )[0] //Ordena o array pela data em ordem decrescente
              : null;

          const mediaInput =
            item.inputProduct.length > 0
              ? item.inputProduct
                  .sort(
                    (a, b) => b.input.data.getTime() - a.input.data.getTime(),
                  )
                  .slice(0, 2) // Seleciona os dois itens mais recentes
              : //.reduce((acc, item) => acc + item.valor, 0) / (2)[0] // Soma os valores e divide por 2 para obter a média
                null;
          //console.log('mediaInput => ', mediaInput);

          return {
            id: item.id,
            capacity: item.capacidade,
            //quantity: item.quantidade,
            value: control?.modelo_PU
              ? control.modelo_PU === 'ultima_nota'
                ? lastInput?.valor
                : control.modelo_PU === 'media_nota'
                ? mediaInput
                : null
              : null,
            odometer: item.fuelling.length
              ? item.fuelling.reduce((acc, current) => {
                  return acc + Number(current.quantidade);
                }, 0)
              : 0,
            quantity,
            fuel: {
              value: item.fuel.id,
              label: item.fuel.descricao + `-${quantity} LT`,
            },
            fuelling: item.fuelling.map((value) => {
              return {
                id: value.id,
                date: value.data_abastecimento,
                quantity: value.quantidade,
                fuel: {
                  value: value.fuel.id,
                  label: value.fuel.descricao,
                },
              };
            }),
          };
        }),
        branch: train.branch
          ? {
              value: train.branch.ID.toString(),
              label: train.branch.filial_numero,
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
  async insertTrain(@Req() req, @Body() body: InsertTrainBody) {
    const user: IUserInfo = req.user;

    const branch = await this.branchRepository.findById(Number(body.branchId));

    if (!branch) {
      throw new NotFoundException(MessageService.ChecklistAction_branchId);
    }

    const validDuplicate = await this.trainRepository.findByClientAndTag(
      user.clientId,
      body.tag,
    );

    if (validDuplicate) {
      throw new ConflictException(MessageService.Fuelling_train_tag_duplicate);
    }

    await this.trainRepository.create({
      id_cliente: user.clientId,
      id_filial: branch.ID,
      tag: body.tag,
      placa: body.name,
      capacidade: body.capacity,
      log_user: user.login,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateTrain(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateTrainBody,
  ) {
    const user: IUserInfo = req.user;

    const train = await this.trainRepository.findById(Number(id));

    if (!train) {
      throw new NotFoundException(MessageService.Fuelling_train_not_found);
    }

    const branch = await this.branchRepository.findById(Number(body.branchId));

    if (!branch) {
      throw new NotFoundException(MessageService.ChecklistAction_branchId);
    }

    train.trainFuel.forEach((compartment) => {
      const inlet = compartment.inputProduct.reduce((acc, current) => {
        return acc + current.quantidade;
      }, 0);

      const outlet = compartment.fuelling.reduce((acc, current) => {
        return acc + Number(current.quantidade);
      }, 0);

      const balance = inlet - outlet;

      if (balance > body.capacity) {
        throw new ConflictException(
          MessageService.Fuelling_train_capacity_less_balance,
        );
      }
    });

    await this.trainRepository.update(train.id, {
      id_filial: branch.ID,
      tag: body.tag,
      placa: body.name,
      capacidade: body.capacity,
      log_user: user.login,
    });

    return {
      update: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteTrain(@Param('id') id: string) {
    const train = await this.trainRepository.findById(Number(id));

    if (!train) {
      throw new NotFoundException(MessageService.Fuelling_train_not_found);
    }

    if (train.trainFuel.some((value) => value.fuelling.length > 0)) {
      throw new NotFoundException(
        MessageService.Fuelling_train_not_delete_bound,
      );
    }

    if (train.fuellingUser.length > 0) {
      throw new NotFoundException(
        MessageService.Fuelling_train_not_delete_bound_user,
      );
    }

    await this.trainRepository.delete(train.id);

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findById(@Req() req, @Param('id') id: string) {
    const train = await this.trainRepository.findById(Number(id));

    if (!train) {
      throw new NotFoundException(MessageService.Fuelling_train_not_found);
    }

    const response = {
      id: train.id,
      train: `${train.tag}-${train.placa}`,
      capacity: train.capacidade,
      branch: train.branch
        ? {
            value: train.branch.ID.toString(),
            label: train.branch.filial_numero,
          }
        : null,
      compartment: train.trainFuel.map((item) => {
        return {
          id: item.id,
          capacity: item.capacidade,
          //quantity: item.quantidade,
          quantity:
            item.inputProduct.reduce((acc, current) => {
              return acc + current.quantidade;
            }, 0) -
            item.fuelling.reduce((acc, current) => {
              return acc + Number(current.quantidade);
            }, 0),
          fuel: {
            value: item.fuel.id,
            label: item.fuel.descricao,
          },
          fuelling: item.fuelling.map((value) => {
            return {
              id: value.id,
              date: value.data_abastecimento,
              quantity: value.quantidade,
              fuel: {
                value: value.fuel.id,
                label: value.fuel.descricao,
              },
            };
          }),
          trainInlet: item.trainInlet.map((value) => {
            return {
              id: value.id,
              date: value.data,
              quantity: value.qtd_litros,
              fuel: {
                value: value.fuel.id,
                label: value.fuel.descricao,
              },
            };
          }),
        };
      }),
    };

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id/compartment')
  async createCompartment(
    @Param('id') id: string,
    @Body() body: InsertCompartmentBody,
  ) {
    const train = await this.trainRepository.findById(Number(id));

    if (!train) {
      throw new NotFoundException(MessageService.Fuelling_train_not_found);
    }

    const fuel = await this.fuelRepository.findById(Number(body.fuelId));

    if (!fuel) {
      throw new NotFoundException(MessageService.Fuelling_fuel_not_found);
    }

    if (body.capacity > train.capacidade) {
      throw new ConflictException(
        MessageService.Fuelling_compartment_bigger_train,
      );
    }

    await this.trainCompartmentRepository.create({
      id_comboio: train.id,
      capacidade: body.capacity,
      id_combustivel: fuel.id,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/compartment/:compartmentId')
  async updateCompartment(
    @Param('compartmentId') compartmentId: string,
    @Body() body: UpdateCompartmentBody,
  ) {
    const compartment = await this.trainCompartmentRepository.findById(
      Number(compartmentId),
    );

    if (!compartment) {
      throw new NotFoundException(
        MessageService.Fuelling_compartment_not_found,
      );
    }

    if (compartment.fuelling.length > 0) {
      throw new NotFoundException(
        MessageService.Fuelling_tank_not_delete_is_bound,
      );
    }

    const fuel = await this.fuelRepository.findById(Number(body.fuelId));

    if (!fuel) {
      throw new NotFoundException(MessageService.Fuelling_fuel_not_found);
    }

    const balance =
      compartment.inputProduct.reduce((acc, current) => {
        return acc + current.quantidade;
      }, 0) -
      compartment.fuelling.reduce((acc, current) => {
        return acc + Number(current.quantidade);
      }, 0);

    if (balance > body.capacity) {
      throw new NotFoundException(
        MessageService.Fuelling_compartment_not_change_capacity,
      );
    }

    await this.trainCompartmentRepository.update(compartment.id, {
      id_combustivel: fuel.id,
      capacidade: body.capacity,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/compartment/:compartmentId')
  async deleteCompartment(@Param('compartmentId') compartmentId: string) {
    const compartment = await this.trainCompartmentRepository.findById(
      Number(compartmentId),
    );

    if (!compartment) {
      throw new NotFoundException(
        MessageService.Fuelling_compartment_not_found,
      );
    }

    if (compartment.fuelling.length || compartment.inputProduct.length) {
      throw new NotFoundException(
        MessageService.Fuelling_tank_not_delete_is_bound,
      );
    }

    await this.trainCompartmentRepository.delete(compartment.id);

    return {
      deleted: true,
    };
  }
}
