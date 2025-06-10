import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { TankRepository } from 'src/repositories/tank-repository';
import InfoDashResponse from './dtos/infoDash-response';
import FuellingTrainRepository from 'src/repositories/fuelling-train-repository';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Fuelling - Report - Control Fuelling')
@Controller('/fuelling/report/control-fuelling')
export default class ControlFuellingController {
  constructor(
    private tankRepository: TankRepository,
    private trainRepository: FuellingTrainRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async infoDash(@Req() req) {
    const user: IUserInfo = req.user;

    const response: InfoDashResponse[] = [];

    const allTank = await this.tankRepository.listFuellingByBranches(
      user.branches,
    );

    allTank.forEach((tank) => {
      const item: InfoDashResponse = {
        name: `${tank.modelo}-${tank.tanque}`,
        tank: [],
      };

      tank.fuellingTankFuel.forEach((value) => {
        const fullEntry = value.inputProduct.reduce((acc, current) => {
          return acc + current.quantidade;
        }, 0);

        const fullOutput = value.fuelling.reduce((acc, current) => {
          return acc + Number(current.quantidade);
        }, 0);

        item.tank.push({
          name: value.fuel.descricao,
          type: 'external',
          maxCapacity: value.capacidade,
          quantity: fullEntry - fullOutput,
        });
      });

      response.push(item);
    });

    const allTrain = await this.trainRepository.listFuellingByBranches(
      user.branches,
    );

    allTrain.forEach((train) => {
      const item: InfoDashResponse = {
        name: `${train.tag}-${train.placa}`,
        tank: [],
      };

      train.trainFuel.forEach((value) => {
        const fullEntry = value.inputProduct.reduce((acc, current) => {
          return acc + current.quantidade;
        }, 0);

        const fullOutput = value.fuelling.reduce((acc, current) => {
          return acc + Number(current.quantidade);
        }, 0);

        item.tank.push({
          name: value.fuel.descricao,
          type: 'internal',
          maxCapacity: value.capacidade,
          quantity: fullEntry - fullOutput,
        });
      });

      response.push(item);
    });

    return {
      data: response,
    };
  }
}
