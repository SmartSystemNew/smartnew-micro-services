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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import FuellingInputFuelRepository from 'src/repositories/fuelling-input-fuel-repository';
import InsertInputBody from './dtos/insertInput-body';
import ProviderRepository from 'src/repositories/provider-repository';
import { MessageService } from 'src/service/message.service';
import FuellingTrainRepository from 'src/repositories/fuelling-train-repository';
import { TankRepository } from 'src/repositories/tank-repository';
import InsertProductBody from './dtos/insertProduct-body';
import FuellingTrainCompartmentRepository from 'src/repositories/fuelling-train-compartment-repository';
import FuellingTankCompartmentRepository from 'src/repositories/fuelling-tank-compartment-repository';
import FuellingInputProductRepository from 'src/repositories/fuelling-input-product-repository';
import { DateService } from 'src/service/data.service';
import UpdateProductBody from './dtos/updateProduct-body';
import UpdateInputBody from './dtos/updateInput-body';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Fuelling - Input')
@Controller('/fuelling/input')
export default class InputController {
  constructor(
    private fuellingInputFuelRepository: FuellingInputFuelRepository,
    private providerRepository: ProviderRepository,
    private trainRepository: FuellingTrainRepository,
    private tankRepository: TankRepository,
    private fuellingTrainCompartmentRepository: FuellingTrainCompartmentRepository,
    private fuellingTankCompartmentRepository: FuellingTankCompartmentRepository,
    private fuellingInputProductRepository: FuellingInputProductRepository,
    private dateService: DateService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async listTable(@Req() req) {
    const user: IUserInfo = req.user;

    const inputFuel = await this.fuellingInputFuelRepository.listByClient(
      user.clientId,
    );

    const lastControl = inputFuel.find((input) => input.train !== null);

    const response = inputFuel.map((input) => {
      return {
        id: input.id,
        fiscalNumber: input.nota_fiscal,
        date: input.data,
        type: input.tank
          ? {
              label: 'Tanque',
              value: 'tank',
            }
          : {
              label: 'Comboio',
              value: 'train',
            },
        bound: input.tank
          ? {
              value: input.tank.id_tanque.toString(),
              text: `${input.tank.modelo}-${input.tank.tanque}`,
            }
          : {
              value: input.train.id.toString(),
              text: `${input.train.tag}-${input.train.placa}`,
            },
        provider: {
          value: input.provider.ID.toString(),
          text: input.provider.razao_social,
        },
        user: input.user.name,
        quantity: input.inputProduct.reduce(
          (acc, current) => acc + current.quantidade,
          0,
        ),
        total: input.inputProduct.reduce(
          (acc, current) => acc + current.valor * current.quantidade,
          0,
        ),
      };
    });

    return {
      data: response,
      lastControl: lastControl ? Number(lastControl.nota_fiscal) + 1 : 0,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async insertInput(@Req() req, @Body() body: InsertInputBody) {
    const user: IUserInfo = req.user;

    const provider = await this.providerRepository.findById(
      Number(body.providerId),
    );

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    let trainId: number | null = null;

    if (body.trainId) {
      const findTrain = await this.trainRepository.findById(
        Number(body.trainId),
      );

      if (!findTrain) {
        throw new NotFoundException(MessageService.Fuelling_train_not_found);
      }

      trainId = findTrain.id;
    }

    let tankId: number | null = null;

    if (body.tankId) {
      const findTank = await this.tankRepository.findById(Number(body.tankId));

      if (!findTank) {
        throw new NotFoundException(MessageService.Fuelling_tank_not_found);
      }

      tankId = findTank.id_tanque;
    }

    if (!trainId && !tankId) {
      throw new ConflictException(
        MessageService.Fuelling_not_tank_or_train_input,
      );
    }

    const validDuplicate =
      await this.fuellingInputFuelRepository.findByClientAndFiscalAndProvider(
        user.clientId,
        body.fiscalNumber,
        provider.ID,
      );

    if (validDuplicate) {
      throw new ConflictException(
        MessageService.Fuelling_duplicate_fiscal_number_input,
      );
    }

    const input = await this.fuellingInputFuelRepository.create({
      id_cliente: user.clientId,
      id_fornecedor: provider.ID,
      data: this.dateService.dayjs(body.date).toDate(),
      nota_fiscal: body.fiscalNumber,
      id_comboio: trainId,
      id_tanque: tankId,
      log_user: user.login,
    });

    return {
      inserted: true,
      id: input.id,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findById(@Param('id') id: string) {
    const input = await this.fuellingInputFuelRepository.findById(Number(id));

    if (!input) {
      throw new NotFoundException(MessageService.Fuelling_input_not_found);
    }

    const response = {
      id: input.id,
      fiscalNumber: input.nota_fiscal,
      date: input.data,
      type: input.tank
        ? {
            label: 'Tanque',
            value: 'tank',
          }
        : {
            label: 'Comboio',
            value: 'train',
          },
      bound: input.tank
        ? {
            value: input.tank.id_tanque.toString(),
            text: `${input.tank.modelo}-${input.tank.tanque}`,
          }
        : {
            value: input.train.id.toString(),
            text: `${input.train.tag}-${input.train.placa}`,
          },
      provider: {
        value: input.provider.ID.toString(),
        text: input.provider.razao_social,
      },
      user: input.user.name,
      quantity: input.inputProduct.reduce(
        (acc, current) => acc + current.quantidade,
        0,
      ),
      total: input.inputProduct.reduce(
        (acc, current) => acc + current.valor,
        0,
      ),
      product: input.inputProduct.map((value) => {
        return {
          id: value.id,
          compartmentId: value.fuelTank
            ? value.fuelTank.fuel.descricao
            : value.fuelTrain.fuel.descricao,
          value: value.valor,
          quantity: value.quantidade,
        };
      }),
    };

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateInput(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateInputBody,
  ) {
    const user: IUserInfo = req.user;

    const input = await this.fuellingInputFuelRepository.findById(Number(id));

    if (!input) {
      throw new NotFoundException(MessageService.Fuelling_input_not_found);
    }

    const provider = await this.providerRepository.findById(
      Number(body.providerId),
    );

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    let trainId: number | null = null;

    if (body.trainId) {
      const findTrain = await this.trainRepository.findById(
        Number(body.trainId),
      );

      if (!findTrain) {
        throw new NotFoundException(MessageService.Fuelling_train_not_found);
      }

      trainId = findTrain.id;
    }

    let tankId: number | null = null;

    if (body.tankId) {
      const findTank = await this.tankRepository.findById(Number(body.tankId));

      if (!findTank) {
        throw new NotFoundException(MessageService.Fuelling_tank_not_found);
      }

      tankId = findTank.id_tanque;
    }

    if (!trainId && !tankId) {
      throw new ConflictException(
        MessageService.Fuelling_not_tank_or_train_input,
      );
    }

    await this.fuellingInputFuelRepository.update(input.id, {
      id_cliente: user.clientId,
      id_fornecedor: provider.ID,
      data: this.dateService.dayjs(body.date).toDate(),
      nota_fiscal: body.fiscalNumber,
      id_comboio: trainId,
      id_tanque: tankId,
      log_user: user.login,
    });

    return {
      inserted: true,
      id: input.id,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteInput(@Req() req, @Param('id') id: string) {
    const input = await this.fuellingInputFuelRepository.findById(Number(id));

    if (!input) {
      throw new NotFoundException(MessageService.Fuelling_input_not_found);
    }

    if (input.inputProduct.length > 0) {
      throw new ConflictException(MessageService.Fuelling_input_has_product);
    }

    await this.fuellingInputFuelRepository.delete(input.id);

    return {
      delete: true,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id/product')
  async inputProduct(
    @Req() req,
    @Param('id') id: string,
    @Body() body: InsertProductBody,
  ) {
    const user: IUserInfo = req.user;

    const input = await this.fuellingInputFuelRepository.findById(Number(id));

    if (!input) {
      throw new NotFoundException(MessageService.Fuelling_input_not_found);
    }

    let trainCompartmentId: number | null = null;
    let tankCompartmentId: number | null = null;

    if (input.train) {
      const compartment =
        await this.fuellingTrainCompartmentRepository.findById(
          Number(body.compartmentId),
        );

      if (!compartment) {
        throw new NotFoundException(
          MessageService.Fuelling_compartment_not_found,
        );
      }

      const totalInput = compartment.inputProduct.reduce((acc, current) => {
        return acc + current.quantidade;
      }, 0);

      const totalOutput = compartment.fuelling.reduce((acc, current) => {
        return acc + Number(current.quantidade);
      }, 0);

      const balance = totalInput - totalOutput;

      if (balance + body.quantity > compartment.capacidade) {
        throw new ConflictException(
          MessageService.Fuelling_input_not_capacity_compartment_create,
        );
      }

      trainCompartmentId = compartment.id;
    } else if (input.tank) {
      const compartment = await this.fuellingTankCompartmentRepository.findById(
        Number(body.compartmentId),
      );

      if (!compartment) {
        throw new NotFoundException(
          MessageService.Fuelling_compartment_not_found,
        );
      }

      const totalInput = compartment.inputProduct.reduce((acc, current) => {
        return acc + current.quantidade;
      }, 0);

      const totalOutput = compartment.fuelling.reduce((acc, current) => {
        return acc + Number(current.quantidade);
      }, 0);

      const balance = totalInput - totalOutput;

      if (balance + body.quantity > compartment.capacidade) {
        throw new ConflictException(
          MessageService.Fuelling_input_not_capacity_compartment_create,
        );
      }

      tankCompartmentId = compartment.id;
    }

    if (!tankCompartmentId && !trainCompartmentId) {
      throw new NotFoundException(
        MessageService.Fuelling_compartment_not_found,
      );
    }

    await this.fuellingInputProductRepository.create({
      id_entrada: input.id,
      valor: body.value,
      quantidade: body.quantity,
      id_compartimento_comboio: trainCompartmentId,
      id_compartimento_tanque: tankCompartmentId,
      log_user: user.login,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/product/:productId')
  async updateProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
    @Body() body: UpdateProductBody,
  ) {
    const input = await this.fuellingInputFuelRepository.findById(Number(id));

    if (!input) {
      throw new NotFoundException(MessageService.Fuelling_input_not_found);
    }

    const product = await this.fuellingInputProductRepository.findById(
      Number(productId),
    );

    if (!product) {
      throw new NotFoundException(
        MessageService.Fuelling_input_product_not_found,
      );
    }

    let trainCompartmentId: number | null = null;
    let tankCompartmentId: number | null = null;

    const valid = product.fuelTank
      ? product.fuelTank.fuelling.findIndex((value) =>
          this.dateService.dayjs(input.data).isBefore(value.data_abastecimento),
        ) >= 0
      : product.fuelTrain.fuelling.findIndex((value) =>
          this.dateService.dayjs(input.data).isBefore(value.data_abastecimento),
        ) >= 0;

    if (valid) {
      throw new ConflictException(
        MessageService.Fuelling_input_product_used_updated,
      );
    }

    if (input.train) {
      const compartment =
        await this.fuellingTrainCompartmentRepository.findById(
          Number(body.compartmentId),
        );

      if (!compartment) {
        throw new NotFoundException(
          MessageService.Fuelling_compartment_not_found,
        );
      }

      const input =
        compartment.inputProduct.reduce((acc, current) => {
          return acc + current.quantidade;
        }, 0) - product.quantidade;

      const output = compartment.fuelling.reduce((acc, current) => {
        return acc + Number(current.quantidade);
      }, 0);

      const balance = input - output;

      if (balance + body.quantity > compartment.capacidade) {
        throw new ConflictException(
          MessageService.Fuelling_input_not_capacity_compartment_create,
        );
      }

      trainCompartmentId = compartment.id;
    } else if (input.tank) {
      const compartment = await this.fuellingTankCompartmentRepository.findById(
        Number(body.compartmentId),
      );

      if (!compartment) {
        throw new NotFoundException(
          MessageService.Fuelling_compartment_not_found,
        );
      }

      const input =
        compartment.inputProduct.reduce((acc, current) => {
          return acc + current.quantidade;
        }, 0) - product.quantidade;

      const output = compartment.fuelling.reduce((acc, current) => {
        return acc + Number(current.quantidade);
      }, 0);

      const balance = input - output;

      if (balance + body.quantity > compartment.capacidade) {
        throw new ConflictException(
          MessageService.Fuelling_input_not_capacity_compartment_create,
        );
      }

      tankCompartmentId = compartment.id;
    }

    if (!tankCompartmentId && trainCompartmentId) {
      throw new NotFoundException(
        MessageService.Fuelling_compartment_not_found,
      );
    }

    await this.fuellingInputProductRepository.update(product.id, {
      valor: body.value,
      quantidade: body.quantity,
      id_compartimento_comboio: trainCompartmentId,
      id_compartimento_tanque: tankCompartmentId,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/product/:productId')
  async deleteProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    const input = await this.fuellingInputFuelRepository.findById(Number(id));

    if (!input) {
      throw new NotFoundException(MessageService.Fuelling_input_not_found);
    }

    const product = await this.fuellingInputProductRepository.findById(
      Number(productId),
    );

    if (!product) {
      throw new NotFoundException(
        MessageService.Fuelling_input_product_not_found,
      );
    }

    const valid = product.fuelTank
      ? product.fuelTank.fuelling.findIndex((value) =>
          this.dateService.dayjs(input.data).isBefore(value.data_abastecimento),
        ) >= 0
      : product.fuelTrain.fuelling.findIndex((value) =>
          this.dateService.dayjs(input.data).isBefore(value.data_abastecimento),
        ) >= 0;

    if (valid) {
      throw new ConflictException(
        MessageService.Fuelling_input_product_used_deleted,
      );
    }

    await this.fuellingInputProductRepository.delete(product.id);

    return {
      deleted: true,
    };
  }
}
