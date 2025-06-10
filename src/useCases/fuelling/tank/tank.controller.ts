import {
  UseGuards,
  Post,
  Req,
  Body,
  Put,
  Param,
  NotFoundException,
  Delete,
  Controller,
  Get,
  ConflictException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { TankRepository } from 'src/repositories/tank-repository';
import { MessageService } from 'src/service/message.service';
import { InsertTankBody } from '../dtos/insertTank-body';
import { UpdateTankBody } from '../dtos/updateTank-body';
import FuellingTankCompartmentRepository from 'src/repositories/fuelling-tank-compartment-repository';
import FindByIdResponse from './dtos/findById-response';
import { FuelRepository } from 'src/repositories/fuel-repository';
import InsertCompartmentBody from './dtos/insertCompartment-body';
import UpdateCompartmentBody from './dtos/updateCompartment-body';
import { z } from 'zod';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Fuelling - Tank')
@Controller('/fuelling/tank')
export default class TankController {
  constructor(
    private tankRepository: TankRepository,
    private fuellingTankCompartmentRepository: FuellingTankCompartmentRepository,
    private fuelRepository: FuelRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async listTank(@Req() req, @Query() queryParams: string) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      s: z.coerce.string().optional(),
      tag: z.coerce.string().optional(),
      description: z.coerce.string().optional(),
    });

    const query = querySchema.parse(queryParams);

    const allTank = await this.tankRepository.listByClientAndBranches(
      user.clientId,
      user.branches,
      {
        ...(query.tag && { modelo: { contains: query.tag } }),
        ...(query.description && { tanque: { contains: query.description } }),
      },
      // query.s && {
      //   OR: [
      //     {
      //       modelo: {
      //         contains: query.s,
      //       },
      //     },
      //     {
      //       tanque: {
      //         contains: query.s,
      //       },
      //     },
      //     {
      //       branch: {
      //         filial_numero: {
      //           contains: query.s,
      //         },
      //       },
      //     },
      //     {
      //       fuellingTankFuel: {
      //         some: {
      //           fuel: {
      //             descricao: {
      //               contains: query.s,
      //             },
      //           },
      //         },
      //       },
      //     },
      //   ],
      // },
    );

    const response = allTank.map((tank) => {
      return {
        id: tank.id_tanque,
        tank: tank.tanque,
        model: tank.modelo,
        stock: tank.estoque,
        odometer: tank.hodometro,
        current: tank.combustivel_atual,
        capacity: tank.capacidade,
        branch: tank.branch
          ? {
              value: tank.branch.ID,
              label: tank.branch.filial_numero,
            }
          : null,
        compartmentAll: tank.fuellingTankFuel.map((item) => {
          const quantity =
            item.inputProduct.reduce((acc, current) => {
              return acc + current.quantidade;
            }, 0) -
            item.fuelling.reduce((acc, current) => {
              return acc + Number(current.quantidade);
            }, 0);

          return {
            id: item.id,
            capacity: item.capacidade,
            //quantity: item.quantidade,
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
            tankInlet: item.inputProduct.map((value) => {
              return {
                id: value.id,
                date: value.input.data,
                quantity: value.quantidade,
                fuel: {
                  value: item.fuel.id,
                  label: item.fuel.descricao,
                },
              };
            }),
          };
        }),
        compartment: tank.fuellingTankFuel
          .map((item) => item.fuel.descricao)
          .join(','),
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async insertTank(@Req() req, @Body() body: InsertTankBody) {
    const user: IUserInfo = req.user;

    const tankExists = await this.tankRepository.findByClientAndModel(
      user.clientId,
      body.model,
    );

    if (tankExists) {
      throw new ConflictException(MessageService.Fuelling_tank_duplicate);
    }

    await this.tankRepository.create({
      ID_cliente: user.clientId,
      id_filial: Number(body.branchId),
      modelo: body.model,
      tanque: body.tank,
      capacidade: body.capacity,
      log_user: user.login,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateTank(@Param('id') id: string, @Body() body: UpdateTankBody) {
    const tank = await this.tankRepository.findById(Number(id));

    if (!tank) {
      throw new NotFoundException(MessageService.Fuelling_tank_not_found);
    }

    await this.tankRepository.update(tank.id_tanque, {
      id_filial: Number(body.branchId),
      modelo: body.model,
      tanque: body.tank,
      capacidade: body.capacity,
    });

    return {
      update: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteTank(@Param('id') id: string) {
    const tank = await this.tankRepository.findById(Number(id));

    if (!tank) {
      throw new NotFoundException(MessageService.Fuelling_tank_not_found);
    }

    if (tank.fuelling.length) {
      throw new NotFoundException(
        MessageService.Fuelling_tank_not_delete_is_bound,
      );
    }

    await this.tankRepository.delete(tank.id_tanque);

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findById(@Param('id') id: string) {
    const tank = await this.tankRepository.findById(Number(id));

    if (!tank) {
      throw new NotFoundException(MessageService.Fuelling_tank_not_found);
    }

    const response: FindByIdResponse = {
      id: tank.id_tanque,
      tank: tank.tanque,
      model: tank.modelo,
      stock: tank.estoque,
      odometer: tank.hodometro,
      current: tank.combustivel_atual,
      capacity: tank.capacidade,
      branch: tank.branch
        ? {
            value: tank.branch.ID,
            label: tank.branch.filial_numero,
          }
        : null,
      compartment: [],
    };

    const allCompartmentTank =
      await this.fuellingTankCompartmentRepository.findByTank(tank.id_tanque);

    allCompartmentTank.forEach((item) => {
      response.compartment.push({
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
        tankInlet: item.inputProduct.map((value) => {
          return {
            id: value.id,
            date: value.input.data,
            quantity: value.quantidade,
            fuel: {
              value: item.fuel.id,
              label: item.fuel.descricao,
            },
          };
        }),
      });
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id/compartment')
  async insertCompartment(
    @Param('id') id: string,
    @Body() body: InsertCompartmentBody,
  ) {
    const tank = await this.tankRepository.findById(Number(id));

    if (!tank) {
      throw new NotFoundException(MessageService.Fuelling_tank_not_found);
    }

    const fuel = await this.fuelRepository.findById(Number(body.fuelId));

    if (!fuel) {
      throw new NotFoundException(MessageService.Fuelling_fuel_not_found);
    }

    let sumAllCompartment = 0;

    tank.fuellingTankFuel.forEach((item) => {
      sumAllCompartment += item.capacidade;
    });

    if (tank.capacidade < sumAllCompartment + body.capacity) {
      throw new NotFoundException(
        MessageService.Fuelling_compartment_bigger_tank,
      );
    }

    await this.fuellingTankCompartmentRepository.create({
      id_tanque: tank.id_tanque,
      id_combustivel: fuel.id,
      capacidade: body.capacity,
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
    const compartment = await this.fuellingTankCompartmentRepository.findById(
      Number(compartmentId),
    );

    if (!compartment) {
      throw new NotFoundException(MessageService.Fuelling_tank_not_found);
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

    await this.fuellingTankCompartmentRepository.update(compartment.id, {
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
    const compartment = await this.fuellingTankCompartmentRepository.findById(
      Number(compartmentId),
    );

    if (!compartment) {
      throw new NotFoundException(MessageService.Fuelling_tank_not_found);
    }

    if (compartment.fuelling.length || compartment.inputProduct.length) {
      throw new NotFoundException(
        MessageService.Fuelling_tank_not_delete_is_bound,
      );
    }

    await this.fuellingTankCompartmentRepository.delete(compartment.id);

    return {
      deleted: true,
    };
  }
}
