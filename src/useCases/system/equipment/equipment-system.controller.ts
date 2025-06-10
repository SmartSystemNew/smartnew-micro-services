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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { BranchRepository } from 'src/repositories/branch-repository';
import { CostCenterRepository } from 'src/repositories/cost-center-repository';
import { EquipmentComponentRepository } from 'src/repositories/equipment-component-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { EquipmentTypeRepository } from 'src/repositories/equipment-type-repository';
import { FamilyRepository } from 'src/repositories/family-repository';
import UnityOfMensurePlansRepository from 'src/repositories/unity-of-mensure-plans-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { MessageService } from 'src/service/message.service';
import { CreateComponentBody } from '../dtos/createComponent-body';
import { CreateEquipmentBody } from '../dtos/createEquipment-body';
import { DeleteAttachBody } from '../dtos/deleteAttach-body';
import { deleteComponentAttachBody } from '../dtos/deleteComponentAttach-body';
import { ListEquipmentQuery } from '../dtos/listEquipment-query';
import { UpdateComponentBody } from '../dtos/updateComponent-body';
import { UpdateEquipmentBody } from '../dtos/updateEquipment-body';

@ApiTags('System - Equipment')
@Controller('system/equipment')
export default class EquipmentController {
  constructor(
    private equipmentRepository: EquipmentRepository,
    private familyRepository: FamilyRepository,
    private equipmentTypeRepository: EquipmentTypeRepository,
    private dateService: DateService,
    private equipmentComponentRepository: EquipmentComponentRepository,
    private unityOfMensurePlansRepository: UnityOfMensurePlansRepository,
    private branchRepository: BranchRepository,
    private costCenterRepository: CostCenterRepository,
    private fileService: FileService,
    private env: ENVService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async listEquipment(@Req() req, @Query() query: ListEquipmentQuery) {
    const user: IUserInfo = req.user;
    const equipment = await this.equipmentRepository.listByBranch(
      user.branches,
      query.filterText &&
        query.filterText !== null &&
        query.filterText !== 'null'
        ? {
            AND: {
              OR: [
                {
                  equipamento_codigo: {
                    contains: query.filterText,
                  },
                },
                {
                  descricao: {
                    contains: query.filterText,
                  },
                },
                {
                  chassi: {
                    contains: query.filterText,
                  },
                },
                {
                  costCenter: {
                    OR: [
                      {
                        centro_custo: {
                          contains: query.filterText,
                        },
                      },
                      {
                        descricao: {
                          contains: query.filterText,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          }
        : undefined,
    );

    const response = equipment.map((equip) => {
      const dateBuy = equip.data_compra;
      const monthGuarantee = equip.garantia;
      let inGuarantee = 'Em Garantia';

      if (dateBuy && monthGuarantee) {
        const diff = this.dateService
          .dayjs(dateBuy)
          .add(Number(monthGuarantee), 'M')
          .isBefore(new Date());

        if (diff) {
          inGuarantee = 'Fora de Garantia';
        }
      }

      return {
        id: equip.ID,
        equipmentCode: equip.equipamento_codigo,
        description: equip.descricao,
        plate: equip.placa,
        chassi: equip.chassi,
        serie: equip.n_serie,
        status: equip.status_equipamento,
        dateBuy,
        monthGuarantee,
        inGuarantee,
        observation: equip.observacoes,
        yearCreated: equip.ano_fabricacao,
        yearModel: equip.ano_modelo,
        fiscalNumber: equip.n_nota_fiscal,
        value: equip.valor_aquisicao,
        image: null,
        branch: {
          value: equip.branch.ID.toString(),
          label: equip.branch.filial_numero,
        },
        costCenter: equip.costCenter
          ? {
              value: equip.costCenter.ID.toString(),
              label: `${equip.costCenter.centro_custo}-${equip.costCenter.descricao}`,
            }
          : null,
        family: equip.family
          ? {
              value: equip.family.ID.toString(),
              label: equip.family.familia,
            }
          : null,
        typeEquipment: equip.typeEquipment
          ? {
              value: equip.typeEquipment.ID.toString(),
              label: equip.typeEquipment.tipo_equipamento,
            }
          : null,
      };
    });

    return { data: response };
  }

  @UseGuards(AuthGuard)
  @Get('/list-status-equipment')
  async listStatusEquipment() {
    const allStatus = [
      'Ativo',
      'Descartado',
      'Desativado',
      'Vendido',
      'Banco',
      'Em Manutencao Externa',
      'Em Reforma',
      'Fora de Operacao',
      'Devolvido',
    ];

    return {
      data: allStatus.map((status) => {
        return {
          label: status,
          value: status,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-consumption-type')
  async listConsumptionTypeEquipment() {
    const allConsumptionType = ['KM/L', 'L/HR'];

    return {
      data: allConsumptionType.map((consumption) => {
        return {
          label: consumption,
          value: consumption,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-component-status')
  async listComponentStatus() {
    const allComponentStatus = [
      'Ativo',
      'Descartado',
      'Desativado',
      'Em Manutencao Externa',
      'Em Estoque',
    ];

    return {
      data: allComponentStatus.map((status) => {
        return {
          label: status,
          value: status,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-fleet')
  async listFleetEquipment() {
    const allFleet = ['PROPRIA', 'TERCEIRO'];

    return {
      data: allFleet.map((fleet) => {
        return {
          label: fleet,
          value: fleet,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-unity')
  async listUnityEquipment(@Req() req) {
    const user: IUserInfo = req.user;

    const allUnity = await this.unityOfMensurePlansRepository.findByClient(
      user.clientId,
    );

    return {
      data: allUnity.map((unity) => {
        return {
          value: unity.id.toString(),
          label: unity.unidade,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-type-equipment')
  async listTypeEquipment(@Req() req) {
    const user: IUserInfo = req.user;

    const allUnity = await this.equipmentTypeRepository.listByClient(
      user.clientId,
    );

    return {
      data: allUnity.map((type) => {
        return {
          value: type.ID.toString(),
          label: type.tipo_equipamento,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async createEquipment(@Req() req, @Body() body: CreateEquipmentBody) {
    const user: IUserInfo = req.user;

    let equipmentDad = { ID: null };

    if (body.equipmentDad) {
      equipmentDad = await this.equipmentRepository.findById(
        Number(body.equipmentDad),
      );
    }

    const branch = await this.branchRepository.findById(Number(body.client));

    if (!branch) {
      throw new NotFoundException(
        MessageService.Excel_contract_branch_not_found,
      );
    }

    let costCenter = { ID: null };

    if (body.costCenter) {
      costCenter = await this.costCenterRepository.findById(
        Number(body.costCenter),
      );
    }

    // if (!costCenter) {
    //   throw new NotFoundException(
    //     MessageService.FinanceItem_cost_center_not_found,
    //   );
    // }

    const family = await this.familyRepository.findById(Number(body.family));

    if (!family) {
      throw new NotFoundException(MessageService.Bound_family_not_found);
    }

    let type = { ID: null };

    if (body.equipmentType) {
      type = await this.equipmentTypeRepository.findById(
        Number(body.equipmentType),
      );
    }

    const validEquipment = await this.equipmentRepository.findByBranchAndCode(
      branch.ID,
      body.equipment,
    );

    if (validEquipment) {
      throw new ConflictException(MessageService.Equipment_Duplicate);
    }

    const equipment = await this.equipmentRepository.create({
      ID_cliente: branch.company.ID,
      ID_filial: branch.ID,
      tag_vinculada: equipmentDad.ID || null,
      id_centro_custo: costCenter.ID || null,
      ID_familia: family.ID,
      ID_tipoeqto: type.ID || null,
      equipamento_codigo: body.equipment,
      descricao: body?.description,
      n_patrimonio: body?.patrimonyNumber ?? null,
      marca: body?.brand ?? null,
      n_serie: body?.serialNumber ?? null,
      chassi: body?.chassis ?? null,
      modelo: body.model,
      fabricante: body.manufacturer,
      custo_hora: body?.costPerHour?.toString() ?? null,
      ano_fabricacao: body.manufacturingYear
        ? this.dateService
            .dayjs(new Date())
            .set('year', body.manufacturingYear)
            .toDate()
        : null,
      ano_modelo: body.modelYear
        ? this.dateService
            .dayjs(new Date())
            .set('year', body.modelYear)
            .toDate()
        : null,
      garantia: body?.guaranteeTime?.toString() ?? null,
      data_compra: body?.buyDate ?? null,
      n_nota_fiscal: body?.fiscalNumber ?? null,
      valor_aquisicao: body?.acquisitionValue ?? null,
      observacoes: body?.observation ?? null,
      log_user: user.login ?? null,
      tipo_consumo: body?.consumptionType ?? null,
      consumo_previsto: body?.consumptionFuel ?? null,
      id_unidade_medida: body?.unityMeter ? Number(body.unityMeter) : null,
      limite_dia_unidade_medida: body.limitUnityMeter
        ? Number(body?.limitUnityMeter)
        : null,
      proprietario: body?.owner ?? null,
      cor: body?.color ?? null,
      codigo_renavam: body?.reindeerCode ?? null,
      numero_crv: body?.CRVNumber ?? null,
      data_emisao_crv: body?.emissionDateCRV ?? null,
      licenciamento: body?.licensing ?? null,
      apolice_seguro: body?.insurancePolicy ?? null,
      vencimento_apolice_seguro: body.insurancePolicyExpiration
        ? this.dateService.dayjs(body.insurancePolicyExpiration).toDate()
        : null,
      n_ct_finame: body?.CTFinameNumber ?? null,
      status_equipamento: body?.equipmentStatus ?? 'Ativo',
      frota: body?.fleet ?? null,
      ficha_tecnica: body?.dataSheet ?? null,
      tipo_os_plano: 0,
      //imagem: body.image,
    });

    // if (files) {
    //   const path = `${this.env.FILE_PATH}/equipment/${equipment.ID}`;
    //   for await (const file of files) {
    //     this.fileService.write(path, file.originalname, file.buffer);
    //   }
    // }

    return {
      inserted: true,
      id: equipment.ID,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findById(@Param('id') id: string) {
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    return {
      data: {
        client: equipment.branch.ID.toString(),
        equipmentDad: equipment?.tag_vinculada?.toString() || null,
        equipment: equipment.equipamento_codigo,
        description: equipment.descricao,
        patrimonyNumber: equipment.n_patrimonio,
        costCenter: equipment?.costCenter?.ID.toString(),
        family: equipment.family.ID.toString(),
        equipmentType: equipment?.typeEquipment?.ID.toString(),
        manufacturer: equipment.fabricante,
        brand: equipment.marca,
        plate: equipment.placa,
        color: equipment.cor,
        chassis: equipment.chassi,
        reindeerCode: equipment.codigo_renavam,
        CRVNumber: equipment.numero_crv,
        emissionDateCRV: equipment.data_emisao_crv,
        licensing: equipment.licenciamento,
        insurancePolicy: equipment.apolice_seguro,
        insurancePolicyExpiration: equipment.vencimento_apolice_seguro
          ? this.dateService
              .dayjs(equipment.vencimento_apolice_seguro)
              .format('YYYY-MM-DD')
          : null,
        CTFinameNumber: equipment.n_ct_finame,
        recipient: equipment.proprietario,
        serialNumber: equipment.n_serie,
        model: equipment.modelo,
        manufacturingYear: equipment.ano_fabricacao
          ? Number(
              this.dateService.dayjs(equipment.ano_fabricacao).format('YYYY'),
            )
          : null,
        modelYear: equipment.ano_modelo
          ? Number(this.dateService.dayjs(equipment.ano_modelo).format('YYYY'))
          : null,
        guaranteeTime: equipment.garantia,
        costPerHour: equipment.custo_hora,
        buyDate: equipment.data_compra
          ? this.dateService.dayjs(equipment.data_compra).format('YYYY-MM-DD')
          : null,
        fiscalNumber: equipment.n_nota_fiscal,
        acquisitionValue: equipment.valor_aquisicao,
        observation: equipment.observacoes,
        equipmentStatus: equipment.status_equipamento,
        images: [],
        consumptionType: equipment.tipo_consumo,
        consumptionFuel: equipment.consumo_previsto,
        unityMeter: equipment?.unityPlans?.id.toString(),
        limitUnityMeter: equipment.limite_dia_unidade_medida,
        owner: equipment.proprietario,
        fleet: equipment.frota,
        dataSheet: equipment.ficha_tecnica,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateEquipment(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateEquipmentBody,
  ) {
    const user: IUserInfo = req.user;
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    let equipmentDad = { ID: null };

    if (body.equipmentDad) {
      equipmentDad = await this.equipmentRepository.findById(
        Number(body.equipmentDad),
      );
    }

    const branch = await this.branchRepository.findById(Number(body.client));

    if (!branch) {
      throw new NotFoundException(
        MessageService.Excel_contract_branch_not_found,
      );
    }

    let costCenter = { ID: null };

    if (body.costCenter) {
      costCenter = await this.costCenterRepository.findById(
        Number(body.costCenter),
      );
    }

    const family = await this.familyRepository.findById(Number(body.family));

    if (!family) {
      throw new NotFoundException(MessageService.Bound_family_not_found);
    }

    let type = { ID: null };

    if (body.equipmentType) {
      type = await this.equipmentTypeRepository.findById(
        Number(body.equipmentType),
      );
    }

    await this.equipmentRepository.update(equipment.ID, {
      ID_cliente: branch.company.ID,
      ID_filial: branch.ID,
      tag_vinculada: equipmentDad?.ID || null,
      id_centro_custo: costCenter.ID || null,
      ID_familia: family.ID,
      ID_tipoeqto: type.ID || null,
      equipamento_codigo: body.equipment,
      descricao: body?.description,
      n_patrimonio: body?.patrimonyNumber ?? null,
      marca: body?.brand ?? null,
      n_serie: body?.serialNumber ?? null,
      chassi: body?.chassis ?? null,
      placa: body.plate ?? null,
      modelo: body.model,
      fabricante: body.manufacturer,
      custo_hora: body?.costPerHour?.toString() ?? null,
      ano_fabricacao: body.manufacturingYear
        ? this.dateService.dayjs(`${body.manufacturingYear}-01-01`).toDate()
        : null,
      ano_modelo: body.modelYear
        ? this.dateService.dayjs(`${body.modelYear}-01-01`).toDate()
        : null,
      garantia: body?.guaranteeTime?.toString() ?? null,
      data_compra: body?.buyDate ?? null,
      n_nota_fiscal: body?.fiscalNumber ?? null,
      valor_aquisicao: body?.acquisitionValue ?? null,
      observacoes: body?.observation ?? null,
      log_user: user.login ?? null,
      tipo_consumo: body?.consumptionType ?? null,
      consumo_previsto: body?.consumptionFuel ?? null,
      id_unidade_medida: body?.unityMeter ? Number(body.unityMeter) : null,
      limite_dia_unidade_medida: body.limitUnityMeter
        ? Number(body?.limitUnityMeter)
        : null,
      proprietario: body?.owner ?? null,
      cor: body?.color ?? null,
      codigo_renavam: body?.reindeerCode ?? null,
      numero_crv: body?.CRVNumber ?? null,
      data_emisao_crv: body?.emissionDateCRV ?? null,
      licenciamento: body?.licensing ?? null,
      apolice_seguro: body?.insurancePolicy ?? null,
      vencimento_apolice_seguro: body.insurancePolicyExpiration
        ? this.dateService.dayjs(body.insurancePolicyExpiration).toDate()
        : null,
      n_ct_finame: body?.CTFinameNumber ?? null,
      status_equipamento: body?.equipmentStatus ?? 'Ativo',
      frota: body?.fleet ?? null,
      ficha_tecnica: body?.dataSheet ?? null,
      tipo_os_plano: 0,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteEquipment(@Param('id') id: string) {
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    try {
      await this.equipmentRepository.delete(equipment.ID);
    } catch (error) {
      console.error(error);
      throw new ConflictException(MessageService.Equipment_not_delete_bound);
    }

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id/attach')
  async listAttach(@Param('id') id: string) {
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    const response: {
      img: {
        url: string;
      }[];
      errorImg: any;
    } = {
      img: [],
      errorImg: false,
    };

    const img: {
      url: string;
    }[] = [];

    try {
      const path = `${this.env.FILE_PATH}/equipment/${equipment.ID}`;

      const fileList = this.fileService.list(path);
      fileList.forEach((fileItem) => {
        img.push({
          url: `${this.env.URL_IMAGE}/equipment/${id}/${fileItem}`,
        });
      });
    } catch (error) {
      console.log(error);
      response.errorImg = {
        message: MessageService.SYSTEM_FTP_IMG_ERROR_CONNECT,
      };
    }

    response.img = img;
    return response;
  }

  @UseGuards(AuthGuard)
  @Post('/:id/attach')
  @UseInterceptors(FileInterceptor('file'))
  async insertAttach(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    const path = `${this.env.FILE_PATH}/equipment/${equipment.ID}`;

    this.fileService.write(path, file.originalname, file.buffer);

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/attach')
  async deleteAttach(@Param('id') id: string, @Body() body: DeleteAttachBody) {
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    const path = `../${body.urlFile}`;

    this.fileService.delete(path);

    return {
      delete: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id/component')
  async listComponent(@Param('id') id: string) {
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    const allComponent =
      await this.equipmentComponentRepository.findByEquipment(equipment.ID);

    const response = allComponent.map((component) => {
      return {
        id: component.id,
        description: component.descricao,
        manufacturer: component.fabricante,
        model: component.modelo,
        serialNumber: component.serie,
        manufacturingYear: component.ano_fabricacao
          ? Number(
              this.dateService.dayjs(component.ano_fabricacao).format('YYYY'),
            )
          : component.ano_fabricacao,
        status: component.id_status_componente,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id/component')
  async createComponent(
    @Param('id') id: string,
    @Body() body: CreateComponentBody,
  ) {
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    const component = await this.equipmentComponentRepository.create({
      id_equipamento: equipment.ID,
      descricao: body.description,
      fabricante: body.manufacturer,
      modelo: body.model,
      serie: body.serialNumber,
      ano_fabricacao: body.manufacturingYear
        ? this.dateService
            .dayjs(new Date())
            .set('year', body.manufacturingYear)
            .toDate()
        : null,
      id_status_componente: body.status,
    });

    return {
      inserted: true,
      id: component.id,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/component/:componentId')
  async updateComponent(
    @Param('componentId') componentId: string,
    @Body() body: UpdateComponentBody,
  ) {
    const component = await this.equipmentComponentRepository.findById(
      Number(componentId),
    );

    if (!component) {
      throw new NotFoundException(
        MessageService.Equipment_component_id_not_found,
      );
    }

    await this.equipmentComponentRepository.update(component.id, {
      descricao: body.description,
      fabricante: body.manufacturer,
      modelo: body.model,
      serie: body.serialNumber,
      ano_fabricacao: this.dateService
        .dayjs(new Date())
        .set('year', body.manufacturingYear)
        .toDate(),
      id_status_componente: body.status,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/component/:componentId')
  async deleteComponent(@Param('componentId') componentId: string) {
    const component = await this.equipmentComponentRepository.findById(
      Number(componentId),
    );

    if (!component) {
      throw new NotFoundException(
        MessageService.Equipment_component_id_not_found,
      );
    }

    await this.equipmentComponentRepository.delete(component.id);

    return {
      delete: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id/component/:componentId/attach')
  async listComponentAttach(
    @Param('id') id: string,
    @Param('componentId') componentId: string,
  ) {
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    const component = await this.equipmentComponentRepository.findById(
      Number(componentId),
    );

    if (!component) {
      throw new NotFoundException(
        MessageService.Equipment_component_id_not_found,
      );
    }

    const response: {
      img: {
        url: string;
      }[];
      errorImg: any;
    } = {
      img: [],
      errorImg: false,
    };

    const img: {
      url: string;
    }[] = [];

    try {
      const path = `${this.env.FILE_PATH}/equipment/${equipment.ID}/component/${component.id}`;

      const fileList = this.fileService.list(path);
      fileList.forEach((fileItem) => {
        img.push({
          url: `${this.env.URL_IMAGE}/equipment/${id}/component${component.id}/${fileItem}`,
        });
      });
    } catch (error) {
      console.log(error);
      response.errorImg = {
        message: MessageService.SYSTEM_FTP_IMG_ERROR_CONNECT,
      };
    }

    response.img = img;
    return response;
  }

  @UseGuards(AuthGuard)
  @Post('/:id/component/:componentId/attach')
  @UseInterceptors(FileInterceptor('file'))
  async insertComponentAttach(
    @Param('id') id: string,
    @Param('componentId') componentId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    const component = await this.equipmentComponentRepository.findById(
      Number(componentId),
    );

    if (!component) {
      throw new NotFoundException(
        MessageService.Equipment_component_id_not_found,
      );
    }

    const path = `${this.env.FILE_PATH}/equipment/${equipment.ID}/component/${component.id}`;

    this.fileService.write(path, file.originalname, file.buffer);

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id/component/:componentId/attach')
  @UseInterceptors(FileInterceptor('file'))
  async deleteComponentAttach(
    @Param('id') id: string,
    @Param('componentId') componentId: string,
    @Body() body: deleteComponentAttachBody,
  ) {
    const equipment = await this.equipmentRepository.findById(Number(id));

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    const component = await this.equipmentComponentRepository.findById(
      Number(componentId),
    );

    if (!component) {
      throw new NotFoundException(
        MessageService.Equipment_component_id_not_found,
      );
    }

    const path = `../${body.urlFile}`;

    this.fileService.delete(path);

    return {
      delete: true,
    };
  }
}
