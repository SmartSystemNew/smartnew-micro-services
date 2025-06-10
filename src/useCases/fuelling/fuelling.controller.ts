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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { FuelRepository } from 'src/repositories/fuel-repository';
import { FuelStationRepository } from 'src/repositories/fuel-station-repository';
import { FuellingControlUserRepository } from 'src/repositories/fuelling-control-user-repository';
import { FuellingRepository } from 'src/repositories/fuelling-repository';
import FuellingTrainRepository from 'src/repositories/fuelling-train-repository';
import { TankRepository } from 'src/repositories/tank-repository';
import { ListFuellingQuery } from './dtos/listFuelling-query';
import { FuellingSync } from './dtos/fuellingSync-body';
import { MessageService } from 'src/service/message.service';
import ListFuellingResponse from './dtos/listFuellingTable-response';
import ListFuellingTableQuery from './dtos/listFuellingTable-query';
import FuellingTrainCompartmentRepository from 'src/repositories/fuelling-train-compartment-repository';
import FuellingTankCompartmentRepository from 'src/repositories/fuelling-tank-compartment-repository';
import { DateService } from 'src/service/data.service';
import DeleteAttachBody from './dtos/deleteAttach-body';
import { FileService } from 'src/service/file.service';
import { ENVService } from 'src/service/env.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { z } from 'zod';
import InsertFuellingBody from './dtos/insertFuelling-body';
import UpdateFuellingBody from './dtos/updateFuelling-body';
import FuellingControlRepository from 'src/repositories/fuelling-control-repository';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import ProviderRepository from 'src/repositories/provider-repository';

@ApiTags('Fuelling')
@ApiBearerAuth()
@ApiOkResponse({ description: 'Success' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('/fuelling')
export default class FuellingController {
  constructor(
    private envService: ENVService,
    private fileService: FileService,
    private dateService: DateService,
    private fuelStationRepository: FuelStationRepository,
    private tankRepository: TankRepository,
    private fuelRepository: FuelRepository,
    private fuellingRepository: FuellingRepository,
    private fuellingControlUserRepository: FuellingControlUserRepository,
    private equipmentRepository: EquipmentRepository,
    private fuellingTrainRepository: FuellingTrainRepository,
    private fuellingTankCompartmentRepository: FuellingTankCompartmentRepository,
    private fuellingTrainCompartmentRepository: FuellingTrainCompartmentRepository,
    private fuellingControlRepository: FuellingControlRepository,
    private providerRepository: ProviderRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/list-fuel-station')
  async listFuelStation(@Req() req) {
    const user: IUserInfo = req.user;

    const allStation = await this.fuelStationRepository.findByClient(
      user.clientId,
    );

    const response = allStation.map((station) => {
      return {
        value: station.id.toString(),
        label: station.descricao,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-tank')
  async listTank(@Req() req) {
    const user: IUserInfo = req.user;

    const allTank = await this.tankRepository.listByClientAndBranches(
      user.clientId,
      user.branches,
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
              value: tank.branch.ID.toString(),
              label: tank.branch.filial_numero,
            }
          : null,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-fuel')
  async listFuel(@Req() req) {
    const user: IUserInfo = req.user;

    const allFuel = await this.fuelRepository.listByClient(user.clientId);

    const response = allFuel.map((fuel) => {
      return {
        value: fuel.id.toString(),
        label: fuel.descricao,
        unity: fuel.unidade,
      };
    });

    return { data: response };
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  async findUser(@Req() req) {
    const user: IUserInfo = req.user;

    const control = await this.fuellingControlUserRepository.findByLogin(
      user.login,
    );

    const response = control
      ? {
          name: user.name,
          branch: {
            value: control.branch.ID,
            label: control.branch.filial_numero,
          },
          company: {
            value: user.clientId,
            label: user.company.name,
          },
          driver: control.motorista,
          supplier: control.abastecedor,
          code: control.codigo,
          train: control.train ? control.train.id : null,
        }
      : null;

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-equipment')
  async listEquipment(@Req() req) {
    const user: IUserInfo = req.user;

    const allEquipment = await this.equipmentRepository.listByBranch(
      user.branches,
      {
        status_equipamento: 'Ativo',
      },
    );

    const response = allEquipment.map((equipment) => {
      return {
        value: equipment.ID.toString(),
        label: `${equipment.equipamento_codigo} - ${equipment.descricao}`,
        counter: equipment.fuelling.length
          ? equipment.fuelling[equipment.fuelling.length - 1].contadorAtual
          : 0,
        type: equipment.tipo_consumo,
      };
    });

    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/list-driver')
  async listDriver(@Req() req) {
    const user: IUserInfo = req.user;

    // const infoUser = await this.fuellingControlUserRepository.findByLogin(
    //   user.login,
    // );

    const allDriver = await this.fuellingControlUserRepository.listByBranches(
      user.branches,
    );

    const response = [];

    allDriver.forEach((driver) => {
      if (driver.motorista) {
        response.push({
          value: driver.user.login,
          label: driver.user.name,
        });
      }
    });

    return { data: response };
  }

  @UseGuards(AuthGuard)
  @Get('/list-supplier')
  async listSupplier(@Req() req) {
    const user: IUserInfo = req.user;

    const infoUser = await this.fuellingControlUserRepository.findByLogin(
      user.login,
    );

    const allSupplier =
      await this.fuellingControlUserRepository.listSupplierByBranch(
        infoUser.branch.ID,
      );

    const response = allSupplier.map((supplier) => {
      return {
        value: supplier.user.login,
        label: supplier.user.name,
      };
    });

    return { data: response };
  }

  @UseGuards(AuthGuard)
  @Get('/list-train')
  async listTrain(@Req() req) {
    const user: IUserInfo = req.user;

    const listTrain = await this.fuellingTrainRepository.listByBranches(
      user.branches,
    );

    const response = listTrain.map((train) => {
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
        value: train.id,
        label: train.tag,
        code,
        supplier,
        fuel: train.trainFuel.map((fuel) => {
          return {
            id: fuel.id,
            name: fuel.fuel.descricao,
            capacity: fuel.capacidade,
            quantity: fuel.quantidade,
          };
        }),
      };
    });

    return { data: response };
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async listFuelling(@Req() req, @Query() query: ListFuellingQuery) {
    const user: IUserInfo = req.user;

    const infoUser = await this.fuellingControlUserRepository.findByLogin(
      user.login,
    );

    const fuellingControl = await this.fuellingControlRepository.listByClient(
      user.clientId,
    );

    let dateFrom = this.dateService
      .dayjsSubTree(new Date())
      .subtract(fuellingControl.filtro_dia, 'd')
      .toDate();

    if (fuellingControl) {
      dateFrom = this.dateService
        .dayjsSubTree(new Date())
        .subtract(fuellingControl.filtro_dia, 'd')
        .toDate();
    }

    const response: { external: Array<object>; internal: Array<object> } = {
      external: [],
      internal: [],
    };

    if (infoUser.motorista) {
      const schemaQuery = z.object({
        equipmentId: z.coerce.number(),
      });

      const valid = schemaQuery.safeParse(query);

      if (!valid.success) {
        throw new ConflictException(valid);
      }

      const { equipmentId } = valid.data;

      const allFueling =
        await this.fuellingRepository.listByEquipmentAndDriverAndDate(
          equipmentId,
          user.login,
          dateFrom,
        );

      const external = allFueling
        .filter((fuelling) => fuelling.tipo === 'EXTERNO')
        .map((fuelling) => {
          return {
            id: fuelling.id,
            fiscalNumber: fuelling.numero_nota_fiscal,
            requestNumber: fuelling.numero_requisicao,
            fuellingDate: fuelling.data_abastecimento,
            value: fuelling.valorUN,
            quantity: fuelling.quantidade,
            observation: fuelling.observacoes,
            consumption: fuelling.consumo_realizado,
            odometerLast: fuelling.hodometro_anterior,
            odometer: fuelling.hodometro_tanque,
            counterLast: fuelling.contadorAnterior,
            counter: fuelling.contadorAtual,
            user: fuelling.user,
            company: {
              value: fuelling.branch.company.ID.toString(),
              label: fuelling.branch.company.razao_social,
            },
            driver: fuelling.driver
              ? {
                  value: fuelling.driver.login,
                  label: fuelling.driver.name,
                }
              : null,
            supplier: fuelling.supplier
              ? {
                  value: fuelling.supplier.login,
                  name: fuelling.supplier.name,
                }
              : null,
            branch: {
              value: fuelling.id.toString(),
              label: fuelling.branch.filial_numero,
            },
            equipment: {
              value: fuelling.equipment.ID.toString(),
              label: `${fuelling.equipment.equipamento_codigo} - ${fuelling.equipment.descricao}`,
            },
            fuelStation: fuelling.fuelStation
              ? {
                  value: fuelling.fuelStation.id.toString(),
                  label: fuelling.fuelStation.descricao,
                }
              : null,
            fuel: {
              value: fuelling.fuel.id.toString(),
              label: fuelling.fuel.descricao,
            },
            train: fuelling.train
              ? {
                  value: fuelling.train.id.toString(),
                  label: `${fuelling.train.tag} - ${fuelling.train.placa}`,
                }
              : null,
            compartment: fuelling.trainFuelling
              ? {
                  value: fuelling.trainFuelling.id.toString(),
                  fuel: {
                    value: fuelling.trainFuelling.fuel.id.toString(),
                    label: fuelling.trainFuelling.fuel.descricao,
                  },
                }
              : fuelling.tankFuelling
              ? {
                  value: fuelling.tankFuelling.id.toString(),
                  fuel: {
                    value: fuelling.tankFuelling.fuel.id.toString(),
                    label: fuelling.tankFuelling.fuel.descricao,
                  },
                }
              : null,
            tank: fuelling.tank
              ? {
                  value: fuelling.tank.id_tanque.toString(),
                  label: `${fuelling.tank.modelo} - ${fuelling.tank.tanque}`,
                }
              : null,
          };
        });

      const internal = allFueling
        .filter((fuelling) => fuelling.tipo === 'INTERNO')
        .map((fuelling) => {
          return {
            id: fuelling.id,
            fiscalNumber: fuelling.numero_nota_fiscal,
            requestNumber: fuelling.numero_requisicao,
            fuellingDate: fuelling.data_abastecimento,
            value: fuelling.valorUN,
            quantity: fuelling.quantidade,
            observation: fuelling.observacoes,
            consumption: fuelling.consumo_realizado,
            odometerLast: fuelling.hodometro_anterior,
            odometer: fuelling.hodometro_tanque,
            counterLast: fuelling.contadorAnterior,
            counter: fuelling.contadorAtual,
            user: fuelling.user,
            company: {
              value: fuelling.branch.company.ID.toString(),
              label: fuelling.branch.company.razao_social,
            },
            driver: fuelling.driver
              ? {
                  value: fuelling.driver.login,
                  label: fuelling.driver.name,
                }
              : null,
            supplier: fuelling.supplier
              ? {
                  value: fuelling.supplier.login,
                  name: fuelling.supplier.name,
                }
              : null,
            branch: {
              value: fuelling.id.toString(),
              label: fuelling.branch.filial_numero,
            },
            equipment: {
              value: fuelling.equipment.ID.toString(),
              label: `${fuelling.equipment.equipamento_codigo} - ${fuelling.equipment.descricao}`,
            },
            fuelStation: fuelling.fuelStation
              ? {
                  value: fuelling.fuelStation.id.toString(),
                  label: fuelling.fuelStation.descricao,
                }
              : null,
            fuel: {
              value: fuelling.fuel.id.toString(),
              label: fuelling.fuel.descricao,
            },
            train: fuelling.train
              ? {
                  value: fuelling.train.id.toString(),
                  label: `${fuelling.train.tag} - ${fuelling.train.placa}`,
                }
              : null,
            tank: fuelling.tank
              ? {
                  value: fuelling.tank.id_tanque.toString(),
                  label: `${fuelling.tank.modelo} - ${fuelling.tank.tanque}`,
                }
              : null,
            compartment: fuelling.trainFuelling
              ? {
                  value: fuelling.trainFuelling.id.toString(),
                  fuel: {
                    value: fuelling.trainFuelling.fuel.id.toString(),
                    label: fuelling.trainFuelling.fuel.descricao,
                  },
                }
              : fuelling.tankFuelling
              ? {
                  value: fuelling.tankFuelling.id.toString(),
                  fuel: {
                    value: fuelling.tankFuelling.fuel.id.toString(),
                    label: fuelling.tankFuelling.fuel.descricao,
                  },
                }
              : null,
          };
        });

      response.external = external;
      response.internal = internal;
    } else if (infoUser.abastecedor) {
      const allFueling =
        await this.fuellingRepository.listByEquipmentAndSupplierAndDate(
          user.login,
          dateFrom,
        );

      const internal = allFueling
        .filter((fuelling) => fuelling.tipo === 'INTERNO')
        .map((fuelling) => {
          return {
            id: fuelling.id,
            fiscalNumber: fuelling.numero_nota_fiscal,
            requestNumber: fuelling.numero_requisicao,
            fuellingDate: fuelling.data_abastecimento,
            value: fuelling.valorUN,
            quantity: fuelling.quantidade,
            observation: fuelling.observacoes,
            consumption: fuelling.consumo_realizado,
            odometerLast: fuelling.hodometro_anterior,
            odometer: fuelling.hodometro_tanque,
            counterLast: fuelling.contadorAnterior,
            counter: fuelling.contadorAtual,
            user: fuelling.user,
            company: {
              value: fuelling.branch.company.ID.toString(),
              label: fuelling.branch.company.razao_social,
            },
            driver: fuelling.driver
              ? {
                  value: fuelling.driver.login,
                  label: fuelling.driver.name,
                }
              : null,
            supplier: fuelling.supplier
              ? {
                  value: fuelling.supplier.login,
                  name: fuelling.supplier.name,
                }
              : null,
            branch: {
              id: fuelling.id,
              name: fuelling.branch.filial_numero,
            },
            equipment: {
              value: fuelling.equipment.ID,
              label: `${fuelling.equipment.equipamento_codigo} - ${fuelling.equipment.descricao}`,
            },
            fuelStation: fuelling.provider
              ? {
                  id: fuelling.provider.ID,
                  name: fuelling.provider.nome_fantasia,
                }
              : null,
            fuel: {
              value: fuelling.fuel.id.toString(),
              label: fuelling.fuel.descricao,
            },
            train: fuelling.train
              ? {
                  value: fuelling.train.id.toString(),
                  label: `${fuelling.train.tag} - ${fuelling.train.placa}`,
                }
              : null,
            tank: fuelling.tank
              ? {
                  value: fuelling.tank.id_tanque.toString(),
                  label: `${fuelling.tank.modelo} - ${fuelling.tank.tanque}`,
                }
              : null,
            compartment: fuelling.trainFuelling
              ? {
                  value: fuelling.trainFuelling.id.toString(),
                  fuel: {
                    value: fuelling.trainFuelling.fuel.id.toString(),
                    label: fuelling.trainFuelling.fuel.descricao,
                  },
                }
              : fuelling.tankFuelling
              ? {
                  value: fuelling.tankFuelling.id.toString(),
                  fuel: {
                    value: fuelling.tankFuelling.fuel.id.toString(),
                    label: fuelling.tankFuelling.fuel.descricao,
                  },
                }
              : null,
          };
        });

      response.internal = internal;
    }

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/info')
  async listFuellingTable(@Req() req, @Query() query) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      perPage: z.coerce
        .string()
        .transform((value) =>
          value === '' || value === 'null' ? null : Number(value),
        )
        .optional()
        .nullable(),
      index: z.coerce
        .string()
        .transform((value) =>
          value === '' || value === 'null' ? null : Number(value),
        )
        .optional()
        .nullable(),
      equipment: z.coerce
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
      type: z
        .string()
        .transform((value) =>
          value === ''
            ? null
            : value === 'INTERNO'
            ? 'INTERNO'
            : value === 'EXTERNO'
            ? 'EXTERNO'
            : null,
        )
        .optional(),
      product: z.coerce
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
      dateFrom: z.coerce
        .string()
        .transform((value) => (value.length ? new Date(value) : null))
        .optional(),
      dateTo: z.coerce
        .string()
        .transform((value) => (value.length ? new Date(value) : null))
        .optional(),
    });

    const request: ListFuellingTableQuery = querySchema.parse(query);

    //console.log(request);

    const allFueling = await this.fuellingRepository.listByBranches(
      user.branches,
      request.perPage,
      request.index,
      {
        ...(request.equipment &&
          request.equipment.length && {
            equipment: {
              ID: {
                in: request.equipment,
              },
            },
          }),
        ...(request.type &&
          request.type.length && {
            tipo: request.type,
          }),
        ...(request.product &&
          request.product.length && {
            fuel: {
              id: {
                in: request.product,
              },
            },
          }),
        ...(request.dateFrom || request.dateTo
          ? {
              data_abastecimento: {
                ...(request.dateFrom && {
                  gte: this.dateService
                    .dayjsAddTree(request.dateFrom)
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                }),
                ...(request.dateTo && {
                  lte: this.dateService
                    .dayjsAddTree(request.dateTo)
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                }),
              },
            }
          : {}),
      },
    );

    const countItem = await this.fuellingRepository.listByBranches(
      user.branches,
      null,
      null,
      {
        ...(request.equipment &&
          request.equipment.length && {
            equipment: {
              ID: {
                in: request.equipment,
              },
            },
          }),
        ...(request.type &&
          request.type.length && {
            tipo: request.type,
          }),
        ...(request.product &&
          request.product.length && {
            fuel: {
              id: {
                in: request.product,
              },
            },
          }),
        ...(request.dateFrom || request.dateTo
          ? {
              data_abastecimento: {
                ...(request.dateFrom && {
                  gte: this.dateService
                    .dayjsAddTree(request.dateFrom)
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                }),
                ...(request.dateTo && {
                  lte: this.dateService
                    .dayjsAddTree(request.dateTo)
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                }),
              },
            }
          : {}),
      },
    );

    // const countItem =
    //   request.perPage && request.index
    //     ? await this.fuellingRepository.countListByBranchesPerPage(
    //         user.branches,
    //         request.perPage,
    //         request.index,
    //       )
    //     : await this.fuellingRepository.countListByBranches(user.branches);

    const response: ListFuellingResponse[] = allFueling.map((fuelling) => {
      return {
        id: fuelling.id,
        equipment: `${fuelling.equipment.equipamento_codigo}-${fuelling.equipment.descricao}`,
        fuelStation: fuelling?.provider?.nome_fantasia ?? null,
        typeSupplier: fuelling.train
          ? 'train'
          : fuelling.tank
          ? 'tank'
          : fuelling.provider
          ? 'post'
          : null,
        train: fuelling.train
          ? `${fuelling.train.tag}-${fuelling.train.placa}`
          : null,
        // trainFuelling: fuelling.trainFuelling
        //   ? fuelling.trainFuelling.fuel.descricao
        //   : null,
        tank: fuelling.tank
          ? `${fuelling.tank.modelo}-${fuelling.tank.tanque}`
          : null,
        // tankFuelling: fuelling.tankFuelling
        //   ? fuelling.tankFuelling.fuel.descricao
        //   : null,
        compartment: fuelling.trainFuelling
          ? fuelling.trainFuelling.fuel.descricao
          : fuelling.tankFuelling
          ? fuelling.tankFuelling.fuel.descricao
          : fuelling.provider
          ? fuelling.fuel.descricao
          : null,
        fiscalNumber: fuelling.numero_nota_fiscal,
        requestNumber: fuelling.numero_requisicao,
        driver: fuelling?.driver?.name ?? null,
        supplier: fuelling?.supplier?.name ?? null,
        user: fuelling.user.name,
        date: fuelling.data_abastecimento,
        value: fuelling.valorUN,
        quantidade: fuelling.quantidade,
        observation: fuelling.observacoes,
        consumption: fuelling.consumo_realizado,
        odometerLast: fuelling.hodometro_anterior,
        odometer: fuelling.hodometro_tanque,
        counterLast: fuelling.contadorAnterior,
        counter: fuelling.contadorAtual,
        type: fuelling.tipo,
        total: Number(fuelling.valorUN) * Number(fuelling.quantidade),
      };
    });

    return { rows: response, pageCount: countItem.length };
  }

  @UseGuards(AuthGuard)
  @Post('/sync')
  async fuellingSync(@Req() req, @Body() body: FuellingSync) {
    const user: IUserInfo = req.user;

    const { create, update, del } = body;

    //const { create, update, del } = body;
    console.log('iniciando sincronizacao');

    if (create) {
      console.log('Criando abastecimento => ', create);
      const equipment = await this.equipmentRepository.findById(
        create.equipmentId,
      );

      if (!equipment) {
        throw new NotFoundException(MessageService.Equipment_not_found);
      }

      let fuelStation = { ID: null };

      if (create.fuelStationId) {
        fuelStation = await this.providerRepository.findById(
          Number(create.fuelStationId),
        );
      }

      const fuel = await this.fuelRepository.findById(Number(create.fuelId));

      if (!fuel) {
        throw new NotFoundException(MessageService.Fuelling_fuel_not_found);
      }

      let train = { id: null };

      const compartment = { id: null, hodometro: 0, quantidade: 0 };

      if (create.trainId && create.compartmentId) {
        train = await this.fuellingTrainRepository.findById(
          Number(create.trainId),
        );

        const valid = await this.fuellingTrainCompartmentRepository.findById(
          Number(create.compartmentId),
        );

        if (!valid) {
          throw new NotFoundException(
            MessageService.Fuelling_compartment_not_found,
          );
        }

        const balance =
          valid.inputProduct.reduce((acc, current) => {
            return acc + current.quantidade;
          }, 0) -
          valid.fuelling.reduce((acc, current) => {
            return acc + Number(current.quantidade);
          }, 0);

        if (balance < create.quantity) {
          console.error('Sem estoque comboio');
          throw new ConflictException(
            MessageService.Fuelling_not_create_balance_less,
          );
        }

        compartment.id = valid.id;
        compartment.hodometro = valid.fuelling.length
          ? valid.fuelling[valid.fuelling.length - 1].hodometro_tanque
          : 0;
      }

      let tank = { id_tanque: null };

      if (create.tankId && create.compartmentId) {
        tank = await this.tankRepository.findById(Number(create.tankId));

        if (!tank) {
          throw new NotFoundException(MessageService.Fuelling_tank_not_found);
        }

        const valid = await this.fuellingTankCompartmentRepository.findById(
          Number(create.compartmentId),
        );

        if (!valid) {
          throw new NotFoundException(
            MessageService.Fuelling_compartment_not_found,
          );
        }

        const balance =
          valid.inputProduct.reduce((acc, current) => {
            return acc + current.quantidade;
          }, 0) -
          valid.fuelling.reduce((acc, current) => {
            return acc + Number(current.quantidade);
          }, 0);

        if (balance < create.quantity) {
          console.error('Sem estoque comboio');
          throw new ConflictException(
            MessageService.Fuelling_not_create_balance_less,
          );
        }

        compartment.id = valid.id;
        compartment.hodometro = valid.fuelling.length
          ? valid.fuelling[valid.fuelling.length - 1].hodometro_tanque
          : 0;
      }

      if (
        create.type === 'INTERNO' &&
        train.id === null &&
        tank.id_tanque === null
      ) {
        throw new ConflictException(
          MessageService.Fuelling_type_inside_train_and_tank_not_found,
        );
      }

      if (
        create.type === 'EXTERNO' &&
        fuelStation.ID === null &&
        tank.id_tanque === null
      ) {
        throw new ConflictException(
          MessageService.Fuelling_type_outside_fuelStation_and_tank_not_found,
        );
      }

      let driver = { motorista: 0, user: { login: null } };
      let supplier = { abastecedor: 0, user: { login: null } };

      if (create.driver) {
        driver = await this.fuellingControlUserRepository.findByLogin(
          create.driver,
        );

        if (!driver) {
          throw new NotFoundException(
            MessageService.Fuelling_user_not_found_driver,
          );
        } else if (driver.motorista === 0) {
          throw new NotFoundException(MessageService.Fuelling_user_not_driver);
        }
      }

      if (create.supplier) {
        supplier = await this.fuellingControlUserRepository.findByLogin(
          create.supplier,
        );

        if (!supplier) {
          throw new NotFoundException(
            MessageService.Fuelling_user_not_found_supplier,
          );
        } else if (supplier.abastecedor === 0) {
          throw new NotFoundException(
            MessageService.Fuelling_user_not_supplier,
          );
        }
      }

      const date = this.dateService.dayjs(create.fuellingDate).toDate();

      try {
        const fuelling = await this.fuellingRepository.create({
          log_user: user.login,
          login: user.login,
          id_filial: equipment.branch.ID,
          id_equipamento: equipment.ID,
          id_fornecedor: fuelStation.ID,
          id_tanque: tank.id_tanque,
          id_comboio: train.id,
          id_compartimento_tanque:
            tank.id_tanque !== null ? compartment.id : null,
          id_compartimento_comboio: train.id !== null ? compartment.id : null,
          id_combustivel: fuel.id,
          numero_nota_fiscal: create.numberFiscal,
          numero_requisicao: create.numberRequest,
          motorista: driver.user.login,
          abastecedor: supplier.user.login,
          data_abastecimento: date,
          valorUN: create.value,
          quantidade: create.quantity,
          observacoes: create.observation,
          tipo: create.type,
          contadorAnterior: create.counterLast,
          contadorAtual: create.counter,
          consumo_realizado: create.consumption,
          hodometro_anterior: create.odometerLast,
          hodometro_tanque: create.odometer,
        });

        if (tank.id_tanque !== null) {
          await this.fuellingTankCompartmentRepository.update(compartment.id, {
            quantidade: compartment.quantidade - create.quantity,
          });
        } else if (train.id !== null) {
          await this.fuellingTrainCompartmentRepository.update(compartment.id, {
            quantidade: compartment.quantidade - create.quantity,
          });
        }

        return {
          sync: true,
          id: fuelling.id,
        };
      } catch (error) {
        throw new ConflictException(error);
      }
    } else if (update) {
      console.log('Atualizando abastecimento => ', update);
      const fuelling = await this.fuellingRepository.findById(update.id);

      if (!fuelling) {
        throw new NotFoundException(MessageService.Fuelling_id_not_found);
      }

      const equipment = await this.equipmentRepository.findById(
        update.equipmentId,
      );

      if (!equipment) {
        throw new NotFoundException(MessageService.Equipment_not_found);
      }

      let fuelStation = { ID: null };

      if (update.fuelStationId) {
        fuelStation = await this.providerRepository.findById(
          Number(update.fuelStationId),
        );
      }

      const fuel = await this.fuelRepository.findById(Number(update.fuelId));

      if (!fuel) {
        throw new NotFoundException(MessageService.Fuelling_fuel_not_found);
      }

      let train = { id: null };

      const compartment = { id: null, hodometro: 0, quantidade: 0 };

      if (update.trainId && update.compartmentId) {
        train = await this.fuellingTrainRepository.findById(
          Number(update.trainId),
        );

        const valid = await this.fuellingTrainCompartmentRepository.findById(
          Number(update.compartmentId),
        );

        if (!valid) {
          throw new NotFoundException(
            MessageService.Fuelling_compartment_not_found,
          );
        }

        const balance =
          valid.inputProduct.reduce((acc, current) => {
            return acc + current.quantidade;
          }, 0) -
          valid.fuelling.reduce((acc, current) => {
            if (current.id === fuelling.id) {
              return acc + 0;
            }
            return acc + Number(current.quantidade);
          }, 0);

        if (balance < update.quantity) {
          throw new ConflictException(
            MessageService.Fuelling_not_create_balance_less,
          );
        }

        compartment.id = valid.id;
        compartment.hodometro = valid.fuelling.length
          ? valid.fuelling[valid.fuelling.length - 1].hodometro_tanque
          : 0;
      }

      let tank = { id_tanque: null };

      if (update.tankId && update.compartmentId) {
        tank = await this.tankRepository.findById(Number(update.tankId));

        if (!tank) {
          throw new NotFoundException(MessageService.Fuelling_tank_not_found);
        }

        const valid = await this.fuellingTankCompartmentRepository.findById(
          Number(update.compartmentId),
        );

        if (!valid) {
          throw new NotFoundException(
            MessageService.Fuelling_compartment_not_found,
          );
        }

        const balance =
          valid.inputProduct.reduce((acc, current) => {
            return acc + current.quantidade;
          }, 0) -
          valid.fuelling.reduce((acc, current) => {
            if (current.id === fuelling.id) {
              return acc + 0;
            }
            return acc + Number(current.quantidade);
          }, 0);

        if (balance < update.quantity) {
          throw new ConflictException(
            MessageService.Fuelling_not_create_balance_less,
          );
        }

        compartment.id = valid.id;
        compartment.hodometro = valid.fuelling.length
          ? valid.fuelling[valid.fuelling.length - 1].hodometro_tanque
          : 0;
      }

      if (
        update.type === 'INTERNO' &&
        train.id === null &&
        tank.id_tanque === null
      ) {
        throw new ConflictException(
          MessageService.Fuelling_type_inside_train_and_tank_not_found,
        );
      }

      if (
        update.type === 'EXTERNO' &&
        fuelStation.ID === null &&
        tank.id_tanque === null
      ) {
        throw new ConflictException(
          MessageService.Fuelling_type_outside_fuelStation_and_tank_not_found,
        );
      }

      let driver = { motorista: 0, user: { login: null } };
      let supplier = { abastecedor: 0, user: { login: null } };

      if (update.driver) {
        driver = await this.fuellingControlUserRepository.findByLogin(
          update.driver,
        );

        if (!driver) {
          throw new NotFoundException(
            MessageService.Fuelling_user_not_found_driver,
          );
        } else if (driver.motorista === 0) {
          throw new NotFoundException(MessageService.Fuelling_user_not_driver);
        }
      }

      if (update.supplier) {
        supplier = await this.fuellingControlUserRepository.findByLogin(
          update.supplier,
        );

        if (!supplier) {
          throw new NotFoundException(
            MessageService.Fuelling_user_not_found_supplier,
          );
        } else if (supplier.abastecedor === 0) {
          throw new NotFoundException(
            MessageService.Fuelling_user_not_supplier,
          );
        }
      }

      const date = this.dateService.dayjs(update.fuellingDate).toDate();

      try {
        await this.fuellingRepository.update(fuelling.id, {
          log_user: user.login,
          login: user.login,
          id_filial: equipment.branch.ID,
          id_equipamento: equipment.ID,
          id_fornecedor: fuelStation.ID,
          id_comboio: train.id,
          id_combustivel: fuel.id,
          numero_nota_fiscal: update.numberFiscal,
          numero_requisicao: update.numberRequest,
          motorista: driver.user.login,
          abastecedor: supplier.user.login,
          data_abastecimento: date,
          valorUN: update.value,
          quantidade: update.quantity,
          observacoes: update.observation,
          tipo: update.type,
          contadorAnterior: update.counterLast,
          contadorAtual: update.counter,
          consumo_realizado: update.consumption,
          hodometro_anterior: update.odometerLast,
          hodometro_tanque: update.odometer,
        });
      } catch (error) {
        throw new ConflictException(error);
      }

      if (tank.id_tanque !== null) {
        await this.fuellingTankCompartmentRepository.update(compartment.id, {
          quantidade:
            compartment.quantidade +
            Number(fuelling.quantidade) -
            update.quantity,
        });
      } else if (train.id !== null) {
        await this.fuellingTrainCompartmentRepository.update(compartment.id, {
          quantidade:
            compartment.quantidade +
            Number(fuelling.quantidade) -
            update.quantity,
        });
      }

      return {
        sync: true,
      };
    } else if (del) {
      console.log('deletando abastecimento => ', del);
      const fuelling = await this.fuellingRepository.findById(del.id);

      if (!fuelling) {
        throw new NotFoundException(MessageService.Fuelling_id_not_found);
      }

      await this.fuellingRepository.delete(fuelling.id);

      return {
        sync: true,
      };
    }

    return {
      sync: false,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async insertFuelling(@Req() req, @Body() body: InsertFuellingBody) {
    const user: IUserInfo = req.user;

    const equipment = await this.equipmentRepository.findById(
      Number(body.equipmentId),
    );

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }
    let fuel: { id: number | null } = { id: null };

    let fuelStation = { ID: null };

    const compartment = { id: null, quantidade: 0 };

    if (body.fuelStationId) {
      fuelStation = await this.providerRepository.findById(
        Number(body.fuelStationId),
      );

      if (!fuelStation) {
        throw new NotFoundException(
          MessageService.Fuelling_fuelStation_not_found,
        );
      }

      fuel = await this.fuelRepository.findById(Number(body.fuelId));

      if (!fuel) {
        throw new NotFoundException(MessageService.Fuelling_fuel_not_found);
      }
    }

    let train = { id: null };

    if (body.trainId && body.compartmentId) {
      train = await this.fuellingTrainRepository.findById(Number(body.trainId));

      if (!train) {
        throw new NotFoundException(MessageService.Fuelling_train_not_found);
      }

      const compartmentFind =
        await this.fuellingTrainCompartmentRepository.findById(
          Number(body.compartmentId),
        );

      if (!compartmentFind) {
        throw new NotFoundException(
          MessageService.Fuelling_compartment_not_found,
        );
      }

      const balance =
        compartmentFind.inputProduct.reduce((acc, current) => {
          return acc + current.quantidade;
        }, 0) -
        compartmentFind.fuelling.reduce((acc, current) => {
          return acc + Number(current.quantidade);
        }, 0);

      if (balance < body.quantity) {
        throw new ConflictException(
          MessageService.Fuelling_not_create_balance_less,
        );
      }

      compartment.id = compartmentFind.id;
      fuel = compartmentFind.fuel;
    }

    let tank = { id_tanque: null };

    if (body.tankId && body.compartmentId) {
      tank = await this.tankRepository.findById(Number(body.tankId));

      if (!tank) {
        throw new NotFoundException(MessageService.Fuelling_tank_not_found);
      }

      const compartmentFind =
        await this.fuellingTankCompartmentRepository.findById(
          Number(body.compartmentId),
        );

      if (!compartmentFind) {
        throw new NotFoundException(
          MessageService.Fuelling_compartment_not_found,
        );
      }

      const balance =
        compartmentFind.inputProduct.reduce((acc, current) => {
          return acc + current.quantidade;
        }, 0) -
        compartmentFind.fuelling.reduce((acc, current) => {
          return acc + Number(current.quantidade);
        }, 0);

      if (balance < body.quantity) {
        throw new ConflictException(
          MessageService.Fuelling_not_create_balance_less,
        );
      }

      compartment.id = compartmentFind.id;
      fuel = compartmentFind.fuel;
    }

    if (
      body.type === 'INTERNO' &&
      train.id === null &&
      tank.id_tanque === null
    ) {
      throw new ConflictException(
        MessageService.Fuelling_type_inside_train_and_tank_not_found,
      );
    }

    if (
      body.type === 'EXTERNO' &&
      fuelStation.ID === null &&
      tank.id_tanque === null
    ) {
      throw new ConflictException(
        MessageService.Fuelling_type_outside_fuelStation_and_tank_not_found,
      );
    }

    let driver = { motorista: 0, user: { login: null } };
    let supplier = { abastecedor: 0, user: { login: null } };

    if (body.driver) {
      driver = await this.fuellingControlUserRepository.findByLogin(
        body.driver,
      );

      if (!driver) {
        throw new NotFoundException(
          MessageService.Fuelling_user_not_found_driver,
        );
      } else if (driver.motorista === 0) {
        throw new NotFoundException(MessageService.Fuelling_user_not_driver);
      }
    }

    if (body.supplier) {
      supplier = await this.fuellingControlUserRepository.findByLogin(
        body.supplier,
      );

      if (!supplier) {
        throw new NotFoundException(
          MessageService.Fuelling_user_not_found_supplier,
        );
      } else if (supplier.abastecedor === 0) {
        throw new NotFoundException(MessageService.Fuelling_user_not_supplier);
      }
    }

    if (body.counter < body.counterLast) {
      throw new ConflictException(
        MessageService.Fuelling_counter_last_smaller_counter,
      );
    }

    await this.fuellingRepository.create({
      id_filial: equipment.branch.ID,
      id_equipamento: equipment.ID,
      tipo: body.type,
      id_fornecedor: fuelStation.ID,
      id_comboio: train.id,
      id_tanque: tank.id_tanque,
      id_compartimento_comboio: train.id !== null ? compartment.id : null,
      id_compartimento_tanque: tank.id_tanque !== null ? compartment.id : null,
      id_combustivel: fuel.id,
      numero_nota_fiscal: body.fiscalNumber,
      numero_requisicao: body.numberRequest,
      login: user.login,
      log_user: user.login,
      motorista: driver.user.login,
      abastecedor: supplier.user.login,
      data_abastecimento: this.dateService.dayjs(body.date).toDate(),
      valorUN: body.value,
      quantidade: body.quantity,
      observacoes: body.observation,
      contadorAnterior: body.counterLast,
      contadorAtual: body.counter,
      hodometro_anterior: body.odometerLast,
      hodometro_tanque: body.odometer,
      consumo_realizado: body.consumption,
    });

    if (tank.id_tanque !== null) {
      await this.fuellingTankCompartmentRepository.update(compartment.id, {
        quantidade: compartment.quantidade - body.quantity,
      });
    } else if (train.id !== null) {
      await this.fuellingTrainCompartmentRepository.update(compartment.id, {
        quantidade: compartment.quantidade - body.quantity,
      });
    }

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findById(@Param('id') id: string) {
    const fuelling = await this.fuellingRepository.findById(Number(id));

    if (!fuelling) {
      throw new NotFoundException(MessageService.Fuelling_id_not_found);
    }

    const response = {
      id: fuelling.id,
      equipment: {
        value: fuelling.equipment.ID,
        label: `${fuelling.equipment.equipamento_codigo}-${fuelling.equipment.descricao}`,
        type: fuelling.equipment.tipo_consumo,
      },
      fuelStation: fuelling?.provider?.nome_fantasia ?? null,
      fuelStationId: fuelling?.provider?.ID ?? null,
      typeSupplier: fuelling.train
        ? 'train'
        : fuelling.tank
        ? 'tank'
        : fuelling.provider
        ? 'post'
        : null,
      train: fuelling.train
        ? {
            value: fuelling.train.id,
            label: `${fuelling.train.tag}-${fuelling.train.placa}`,
          }
        : null,
      trainFuelling: fuelling.trainFuelling
        ? {
            value: fuelling.trainFuelling.id,
            label: fuelling.trainFuelling.fuel.descricao,
          }
        : null,
      tank: fuelling.tank
        ? {
            value: fuelling.tank.id_tanque,
            label: `${fuelling.tank.modelo}-${fuelling.tank.tanque}`,
          }
        : null,
      tankFuelling: fuelling.tankFuelling
        ? {
            value: fuelling.tankFuelling.id,
            label: fuelling.tankFuelling.fuel.descricao,
          }
        : null,
      fuel: {
        value: fuelling.fuel.id,
        label: fuelling.fuel.descricao,
      },
      fiscalNumber: fuelling.numero_nota_fiscal,
      requestNumber: fuelling.numero_requisicao,
      driver: fuelling.driver
        ? {
            value: fuelling.driver.login,
            label: fuelling.driver.name,
          }
        : null,
      supplier: fuelling.supplier
        ? {
            value: fuelling.supplier.login,
            label: fuelling.supplier.name,
          }
        : null,
      user: fuelling.user.name,
      date: fuelling.data_abastecimento,
      value: fuelling.valorUN,
      quantidade: fuelling.quantidade,
      observation: fuelling.observacoes,
      consumption: fuelling.consumo_realizado,
      odometerLast: fuelling.hodometro_anterior,
      odometer: fuelling.hodometro_tanque,
      counterLast: fuelling.contadorAnterior,
      counter: fuelling.contadorAtual,
      type: fuelling.tipo,
      total: Number(fuelling.valorUN) * Number(fuelling.quantidade),
    };

    return {
      data: response,
    };
  }

  @Get('/:id/attach')
  async listAttach(@Param('id') id: string) {
    const response: {
      img: { url: string }[];
      errorImg?: { message: string };
    } = {
      img: [],
    };

    try {
      const path = `${this.envService.FILE_PATH}/abastecimento/${id}`;

      const fileList = this.fileService.list(path);
      fileList.forEach((fileItem) => {
        response.img.push({
          url: `${this.envService.URL_IMAGE}/abastecimento/${id}/${fileItem}`,
        });
      });
    } catch (error) {
      console.log(error);
      response.errorImg = {
        message: MessageService.SYSTEM_FTP_IMG_ERROR_CONNECT,
      };
    }

    return {
      ...response,
    };
  }

  @Post('/:id/attach')
  @UseInterceptors(FileInterceptor('file'))
  async insertAttach(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const path = `${this.envService.FILE_PATH}/abastecimento/${id}`;

    this.fileService.write(path, file.originalname, file.buffer);

    return {
      insert: true,
      url: `${this.envService.URL_IMAGE}/abastecimento/${id}/${file.originalname}`,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/attach')
  async deleteAttach(@Body() body: DeleteAttachBody) {
    const path = `${this.envService.FILE_PATH}/abastecimento/${body.urlFile}`;

    this.fileService.delete(path);

    return {
      delete: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateFuelling(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateFuellingBody,
  ) {
    const user: IUserInfo = req.user;

    const fuelling = await this.fuellingRepository.findById(Number(id));

    if (!fuelling) {
      throw new NotFoundException(MessageService.Fuelling_id_not_found);
    }

    const equipment = await this.equipmentRepository.findById(
      Number(body.equipmentId),
    );

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    const fuel = await this.fuelRepository.findById(Number(body.fuelId));

    if (!fuel) {
      throw new NotFoundException(MessageService.Fuelling_fuel_not_found);
    }

    let fuelStation = { ID: null };

    const compartment = { id: null, quantidade: 0 };

    if (body.fuelStationId) {
      fuelStation = await this.providerRepository.findById(
        Number(body.fuelStationId),
      );

      if (!fuelStation) {
        throw new NotFoundException(
          MessageService.Fuelling_fuelStation_not_found,
        );
      }
    }

    let train = { id: null };

    if (body.trainId && body.compartmentId) {
      train = await this.fuellingTrainRepository.findById(Number(body.trainId));

      if (!train) {
        throw new NotFoundException(MessageService.Fuelling_train_not_found);
      }

      const compartmentFind =
        await this.fuellingTrainCompartmentRepository.findById(
          Number(body.compartmentId),
        );

      if (!compartmentFind) {
        throw new NotFoundException(
          MessageService.Fuelling_compartment_not_found,
        );
      }

      const balance =
        compartmentFind.trainInlet.reduce((acc, current) => {
          return acc + current.qtd_litros;
        }, 0) -
        compartmentFind.fuelling.reduce((acc, current) => {
          if (fuelling.id === current.id) {
            return acc + 0;
          } else return acc + Number(current.quantidade);
        }, 0);

      if (balance < body.quantity) {
        throw new ConflictException(
          MessageService.Fuelling_not_create_balance_less,
        );
      }

      compartment.id = compartmentFind.id;
    }

    let tank = { id_tanque: null };

    if (body.tankId && body.compartmentId) {
      tank = await this.tankRepository.findById(Number(body.tankId));

      if (!tank) {
        throw new NotFoundException(MessageService.Fuelling_tank_not_found);
      }

      const compartmentFind =
        await this.fuellingTankCompartmentRepository.findById(
          Number(body.compartmentId),
        );

      if (!compartmentFind) {
        throw new NotFoundException(
          MessageService.Fuelling_compartment_not_found,
        );
      }

      const balance =
        compartmentFind.inputProduct.reduce((acc, current) => {
          return acc + current.quantidade;
        }, 0) -
        compartmentFind.fuelling.reduce((acc, current) => {
          if (fuelling.id === current.id) {
            return acc + 0;
          } else return acc + Number(current.quantidade);
        }, 0);

      if (balance < body.quantity) {
        throw new ConflictException(
          MessageService.Fuelling_not_create_balance_less,
        );
      }

      compartment.id = compartmentFind.id;
    }

    if (
      body.type === 'INTERNO' &&
      train.id === null &&
      tank.id_tanque === null
    ) {
      throw new ConflictException(
        MessageService.Fuelling_type_inside_train_and_tank_not_found,
      );
    }

    if (
      body.type === 'EXTERNO' &&
      fuelStation.ID === null &&
      tank.id_tanque === null
    ) {
      throw new ConflictException(
        MessageService.Fuelling_type_outside_fuelStation_and_tank_not_found,
      );
    }

    let driver = { motorista: 0, user: { login: null } };
    let supplier = { abastecedor: 0, user: { login: null } };

    if (body.driver) {
      driver = await this.fuellingControlUserRepository.findByLogin(
        body.driver,
      );

      if (!driver) {
        throw new NotFoundException(
          MessageService.Fuelling_user_not_found_driver,
        );
      } else if (driver.motorista === 0) {
        throw new NotFoundException(MessageService.Fuelling_user_not_driver);
      }
    }

    if (body.supplier) {
      supplier = await this.fuellingControlUserRepository.findByLogin(
        body.supplier,
      );

      if (!supplier) {
        throw new NotFoundException(
          MessageService.Fuelling_user_not_found_supplier,
        );
      } else if (supplier.abastecedor === 0) {
        throw new NotFoundException(MessageService.Fuelling_user_not_supplier);
      }
    }

    if (body.counter < body.counterLast) {
      throw new ConflictException(
        MessageService.Fuelling_counter_last_smaller_counter,
      );
    }

    await this.fuellingRepository.update(fuelling.id, {
      id_filial: equipment.branch.ID,
      id_equipamento: equipment.ID,
      tipo: body.type,
      id_fornecedor: fuelStation.ID,
      id_comboio: train.id,
      id_tanque: tank.id_tanque,
      id_compartimento_comboio: train.id !== null ? compartment.id : null,
      id_compartimento_tanque: tank.id_tanque !== null ? compartment.id : null,
      id_combustivel: fuel.id,
      numero_nota_fiscal: body.fiscalNumber,
      numero_requisicao: body.numberRequest,
      login: user.login,
      log_user: user.login,
      motorista: driver.user.login,
      abastecedor: supplier.user.login,
      data_abastecimento: this.dateService.dayjs(body.date).toDate(),
      valorUN: body.value,
      quantidade: body.quantity,
      observacoes: body.observation,
      contadorAnterior: body.counterLast,
      contadorAtual: body.counter,
      hodometro_anterior: body.odometerLast,
      hodometro_tanque: body.odometer,
      consumo_realizado: body.consumption,
    });

    if (tank.id_tanque !== null) {
      await this.fuellingTankCompartmentRepository.update(compartment.id, {
        quantidade:
          compartment.quantidade + Number(fuelling.quantidade) - body.quantity,
      });
    } else if (train.id !== null) {
      await this.fuellingTrainCompartmentRepository.update(compartment.id, {
        quantidade:
          compartment.quantidade + Number(fuelling.quantidade) - body.quantity,
      });
    }

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteFuelling(@Param('id') id: string) {
    const fuelling = await this.fuellingRepository.findById(Number(id));

    if (!fuelling) {
      throw new NotFoundException(MessageService.Fuelling_id_not_found);
    }

    if (fuelling.tank) {
      const allTank = await this.fuellingRepository.listByCompartmentTank(
        fuelling.id_compartimento_tanque,
      );

      if (allTank.length && allTank[allTank.length - 1].id !== fuelling.id) {
        throw new ConflictException(MessageService.Fuelling_not_delete_last);
      }
    }

    if (fuelling.train) {
      const alLTrain = await this.fuellingRepository.listByCompartmentTrain(
        fuelling.id_compartimento_comboio,
      );

      if (alLTrain.length && alLTrain[alLTrain.length - 1].id !== fuelling.id) {
        throw new ConflictException(MessageService.Fuelling_not_delete_last);
      }
    }

    await this.fuellingRepository.delete(fuelling.id);

    return {
      deleted: true,
    };
  }
}
