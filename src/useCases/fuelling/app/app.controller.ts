import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { TankRepository } from 'src/repositories/tank-repository';
import FuellingTrainRepository from 'src/repositories/fuelling-train-repository';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Fuelling - App')
@Controller('/fuelling/app')
export default class FuellingAppController {
  constructor(
    private tankRepository: TankRepository,
    private trainRepository: FuellingTrainRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/tank')
  async listTank(@Req() req) {
    const user: IUserInfo = req.user;

    const allTank = await this.tankRepository.listByClientAndBranches(
      user.clientId,
      user.branches,
    );

    const response = allTank.map((tank) => {
      return {
        id: tank.id_tanque.toString(),
        description: `${tank.modelo}-${tank.tanque}`,
        stock: tank.estoque,
        // odometer: tank.fuelling.length
        //   ? tank.fuelling[tank.fuelling.length - 1].hodometro_tanque
        //   : 0,
        capacity: tank.capacidade,
        branch: tank.branch
          ? {
              value: tank.branch.ID.toString(),
              label: tank.branch.filial_numero,
            }
          : null,
        compartment: tank.fuellingTankFuel.map((item) => {
          return {
            id: item.id,
            capacity: item.capacidade,
            //quantity: item.quantidade,
            odometer: item.fuelling.length
              ? item.fuelling[item.fuelling.length - 1].hodometro_tanque
              : null,
            quantity:
              item.inputProduct.reduce((acc, current) => {
                return acc + current.quantidade;
              }, 0) -
              item.fuelling.reduce((acc, current) => {
                return acc + Number(current.quantidade);
              }, 0),
            fuel: {
              value: item.fuel.id.toString(),
              label: item.fuel.descricao,
            },
          };
        }),
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/train')
  async listTrain(@Req() req) {
    const user: IUserInfo = req.user;

    const allTrain = await this.trainRepository.listByBranches(user.branches);

    const response = allTrain.map((train) => {
      let code = null;
      let supplier = null;
      const findCodeUser = train.fuellingUser.find(
        (value) => value.user.login === user.login,
      );

      if (findCodeUser) {
        code = findCodeUser.codigo;
        supplier = findCodeUser.user.login;
      }

      return {
        id: train.id,
        description: `${train.tag}-${train.placa}`,
        capacity: train.capacidade,
        code,
        supplier,
        compartment: train.trainFuel.map((compartment) => {
          const quantity =
            compartment.inputProduct.reduce((acc, current) => {
              return acc + current.quantidade;
            }, 0) -
            compartment.fuelling.reduce((acc, current) => {
              return acc + Number(current.quantidade);
            }, 0);

          return {
            id: compartment.id.toString(),
            capacity: compartment.capacidade,
            odometer: compartment.fuelling.length
              ? compartment.fuelling[compartment.fuelling.length - 1]
                  .hodometro_tanque
              : null,
            quantity,
            fuel: {
              value: compartment.fuel.id.toString(),
              label: compartment.fuel.descricao,
            },
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
}
