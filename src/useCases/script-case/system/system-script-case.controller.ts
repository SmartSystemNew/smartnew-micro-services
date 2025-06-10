import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import SelectResponseSwagger from 'src/models/swagger/select-response-swagger';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import { CostCenterRepository } from 'src/repositories/cost-center-repository';
import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
import FinanceTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import GroupRepository from 'src/repositories/group-repository';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import MaterialRepository from 'src/repositories/material-repository';
import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
import { PermissionRepository } from 'src/repositories/permission-repository';
import ProviderRepository from 'src/repositories/provider-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import UserGroupRepository from 'src/repositories/user-group-repository';
import { z } from 'zod';

@ApiTags('Script Case')
@Controller('/script-case/system')
export default class SystemScriptCaseController {
  constructor(
    private permissionRepository: PermissionRepository,
    private materialRepository: MaterialRepository,
    private contractTypeInputRepository: ContractTypeInputRepository,
    private providerRepository: ProviderRepository,
    private financeTypeDocumentRepository: FinanceTypeDocumentRepository,
    private descriptionCostCenterRepository: DescriptionCostCenterRepository,
    private financeTributeRepository: FinanceTributesRepository,
    private financeTypePaymentRepository: FinanceTypePaymentRepository,
    private serviceOrderRepository: ServiceOrderRepository,
    private materialServiceOrderRepository: MaterialServiceOrderRepository,
    private equipmentRepository: EquipmentRepository,
    private costCenterRepository: CostCenterRepository,
    private groupRepository: GroupRepository,
    private userGroupRepository: UserGroupRepository,
    private materialCodeRepository: MaterialCodeRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/permission')
  async permissionForModule(@Req() req) {
    const querySchema = z.object({
      blank: z.string(),
      module: z.coerce.number(),
    });

    const query = querySchema.parse(req.query);

    const user: IUserInfo = req.user;

    const permission =
      await this.permissionRepository.findByApplicationAndGroupAndModule(
        query.blank,
        user.group.id,
        user.login,
        Number(query.module),
      );

    if (!permission) {
      return {
        access: null,
        insert: null,
        update: null,
        delete: null,
        export: null,
        print: null,
      };
    }

    return {
      access: permission.access === 'Y',
      insert: permission.insert === 'Y',
      update: permission.update === 'Y',
      delete: permission.delete === 'Y',
      export: permission.export === 'Y',
      print: permission.print === 'Y',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-material')
  async listMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const allMaterial = await this.materialRepository.listByClientAndActive(
      user.clientId,
    );

    const querySchema = z.object({
      type: z.string().optional().default('material'),
    });

    const query = querySchema.parse(req.query);

    return {
      [query.type]: allMaterial.map((value) => {
        return {
          clientId: value.id_cliente,
          value: value.id,
          text: value.material,
          unity: value.unidade,
          type: value.tipo,
        };
      }),
      success: true,
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

    const querySchema = z.object({
      type: z.string().optional().default('equipment'),
    });

    const query = querySchema.parse(req.query);

    return {
      [query.type]: allEquipment.map((value) => {
        return {
          value: value.ID,
          label: `${value.equipamento_codigo} - ${value.descricao}`,
        };
      }),
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-input')
  async listInput(@Req() req) {
    const user: IUserInfo = req.user;

    const allMaterial = await this.contractTypeInputRepository.listByClient(
      user.clientId,
    );

    return {
      input: allMaterial.map((value) => {
        return {
          value: value.id,
          text: value.insumo,
        };
      }),
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-branch')
  async listBranch(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      type: z.string().optional().default('branch'),
    });

    const query = querySchema.parse(req.query);

    const response = user.branch.map((branch) => {
      return {
        value: branch.id,
        text: `${branch.name} ${branch.cnpj}`,
        //selected: false,
      };
    });

    return { [query.type]: response, success: true };
  }

  @UseGuards(AuthGuard)
  @Get('/list-cost-center')
  async listCostCenter(@Req() req) {
    const querySchema = z.object({
      type: z.string().optional().default('costCenter'),
    });

    const query = querySchema.parse(req.query);

    const costCenter = await this.costCenterRepository.byBranches(
      req.user.branches,
    );

    const response = costCenter.map((value) => {
      return {
        value: value.ID.toString(),
        text: `${value.centro_custo}-${value.descricao}`,
      };
    });

    return {
      [query.type]: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/branch/:branchId/description-cost-center')
  async listDescriptionCostCenterByBranch(
    @Req() req,
    @Param('branchId') branchId: string,
  ) {
    const allDescriptionCostCenter =
      await this.descriptionCostCenterRepository.listByBranchesComplete([
        Number(branchId),
      ]);

    const querySchema = z.object({
      type: z.string().optional().default('description'),
    });

    const query = querySchema.parse(req.query);

    const response = allDescriptionCostCenter.map((description) => {
      return {
        value: description.id,
        text: description.descricao_centro_custo,
        costCenter: description.costCenter.map((costCenter) => {
          return {
            value: costCenter.ID,
            text: `${costCenter.centro_custo}-${costCenter.descricao}`,
            compositionGroup: costCenter.compositionGroup.map(
              (compositionGroup) => {
                return {
                  value: compositionGroup.id,
                  text: `${compositionGroup.composicao}-${compositionGroup.descricao}`,
                  item: compositionGroup.compositionGroupItem.map((item) => {
                    return {
                      value: item.id,
                      text: `${item.composicao}-${item.descricao}`,
                    };
                  }),
                };
              },
            ),
          };
        }),
      };
    });

    return { [query.type]: response, success: true };
  }

  @UseGuards(AuthGuard)
  @Get('/list-description-cost-center')
  async listDescriptionCostCenter(@Req() req) {
    const user: IUserInfo = req.user;

    const allDescriptionCostCenter =
      await this.descriptionCostCenterRepository.listByBranchesComplete(
        user.branches,
      );
    const querySchema = z.object({
      type: z.string().optional().default('description'),
    });

    const query = querySchema.parse(req.query);
    const response = allDescriptionCostCenter.map((description) => {
      return {
        value: description.id,
        text: description.descricao_centro_custo,
        costCenter: description.costCenter.map((costCenter) => {
          return {
            value: costCenter.ID,
            text: `${costCenter.centro_custo}-${costCenter.descricao}`,
            compositionGroup: costCenter.compositionGroup.map(
              (compositionGroup) => {
                return {
                  value: compositionGroup.id,
                  text: `${compositionGroup.composicao}-${compositionGroup.descricao}`,
                  item: compositionGroup.compositionGroupItem.map((item) => {
                    return {
                      value: item.id,
                      text: `${item.composicao}-${item.descricao}`,
                    };
                  }),
                };
              },
            ),
          };
        }),
      };
    });

    return { [query.type]: response, success: true };
  }

  @UseGuards(AuthGuard)
  @Get('/list-provider')
  async listProvider(@Req() req) {
    const user: IUserInfo = req.user;

    const allProvider = await this.providerRepository.listByBranches(
      user.branches,
      user.clientId,
    );
    //console.log(user);

    const provider = allProvider.map((provider) => {
      return {
        id: provider.ID,
        name: `${provider.razao_social} ${provider.cnpj}`,
      };
    });

    return provider;
  }

  @UseGuards(AuthGuard)
  @Get('/list-type-document')
  async lisTypeDocument(@Req() req) {
    const user: IUserInfo = req.user;

    const allTypeDocument =
      await this.financeTypeDocumentRepository.listByClient(user.clientId);

    const typeDocument = allTypeDocument.map((typeDocument) => {
      return {
        id: typeDocument.id,
        name: typeDocument.descricao,
        hasKey: typeDocument.requer_chave,
        maxValue: typeDocument.numberTypeDocument.length
          ? typeDocument.numberTypeDocument[
              typeDocument.numberTypeDocument.length - 1
            ].numero
          : 0,
        automatic: typeDocument.numeracao_automatica,
      };
    });

    return typeDocument;
  }

  @UseGuards(AuthGuard)
  @Get('/type-document')
  async typeDocument(@Req() req) {
    const user: IUserInfo = req.user;

    const allTypeDocument =
      await this.financeTypeDocumentRepository.listByClient(user.clientId);

    const querySchema = z.object({
      type: z.string().optional().default('documentType'),
    });

    const query = querySchema.parse(req.query);

    const typeDocument = allTypeDocument.map((typeDocument) => {
      return {
        value: typeDocument.id,
        text: typeDocument.descricao,
        hasKey: typeDocument.requer_chave,
        maxValue: typeDocument.numberTypeDocument.length
          ? typeDocument.numberTypeDocument[
              typeDocument.numberTypeDocument.length - 1
            ].numero
          : 0,
        automatic: typeDocument.numeracao_automatica,
      };
    });

    return { [query.type]: typeDocument, success: true };
  }

  @UseGuards(AuthGuard)
  @Get('/list-type-payment')
  async listTypePayment(@Req() req) {
    const user: IUserInfo = req.user;

    const allTypePayment = await this.financeTypePaymentRepository.listByClient(
      user.clientId,
    );

    const querySchema = z.object({
      type: z.string().optional().default('typePayment'),
    });

    const query = querySchema.parse(req.query);

    const payment = allTypePayment.map((payment) => {
      return {
        value: payment.id,
        text: payment.descricao,
        installment: payment.parcela === 1,
      };
    });

    return { [query.type]: payment, success: true };
  }

  @UseGuards(AuthGuard)
  @Get('/list-tribute')
  async listTribute(@Req() req) {
    const user: IUserInfo = req.user;

    const allTribute = await this.financeTributeRepository.listByClient(
      user.clientId,
    );

    const querySchema = z.object({
      type: z.string().optional().default('tribute'),
    });

    const query = querySchema.parse(req.query);

    const tribute = allTribute.map((tribute) => {
      return {
        value: tribute.id,
        text: tribute.descricao,
      };
    });

    return { [query.type]: tribute, success: true };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/service-order-branches')
  async serviceOrderByBranches(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.serviceOrderRepository.listServiceOrder(
      user.branches,
      0,
      999,
    );

    const response = querySet.map((obj) => {
      return {
        value: obj.ID.toString(),
        label: `${obj.ordem} - ${obj.descricao_solicitacao}`,
      };
    });

    return {
      data: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/service-order/:id/material')
  async listMaterialByOrder(@Req() req, @Param('id') id: string) {
    const querySchema = z.object({
      type: z.string().optional().default('material'),
    });

    const query = querySchema.parse(req.query);

    const allMaterial =
      await this.materialServiceOrderRepository.listByServiceOrder(Number(id));

    const response = allMaterial.map((obj) => {
      return {
        material: {
          id: obj.materials.id,
          description: `${obj.materials.codigo}-${obj.materials.material}`,
        },
        quantity: obj.quantidade,
        unity: obj?.unidade,
      };
    });

    return {
      [query.type]: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/list-module')
  async listModule(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      type: z.string().optional().default('module'),
    });

    const query = querySchema.parse(req.query);

    const response = user.module.map((value) => {
      return {
        value: value.id,
        text: value.nome,
      };
    });

    return {
      [query.type]: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/list-group')
  async listGroup(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      type: z.string().optional().default('group'),
    });

    const query = querySchema.parse(req.query);

    const allGroup = await this.groupRepository.listByClient(user.clientId);

    const response = allGroup.map((value) => {
      return {
        value: value.group_id,
        text: value.description,
      };
    });

    return {
      [query.type]: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/list-user')
  async listUser(@Req() req) {
    const querySchema = z.object({
      type: z.string().optional().default('user'),
      groupId: z.coerce.number().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    if (!query.groupId) {
      return {
        [query.type]: [],
        success: true,
        message: 'Nenhum usuário encontrado com este grupo.',
      };
    }

    const allGroup = await this.userGroupRepository.listByGroup(query.groupId);

    const response = allGroup.map((value) => {
      return {
        value: value.login,
        text: value.users.login,
      };
    });

    return {
      [query.type]: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/list-menu')
  async listMenu(@Req() req) {
    const querySchema = z.object({
      type: z.string().optional().default('menu'),
      group: z.coerce.number().optional().nullable(),
      moduleSelect: z.coerce.number(),
      userSelect: z.coerce.string().nullable().optional(),
    });

    const query = querySchema.parse(req.query);

    const allGroup = await this.permissionRepository.listForGroupAndModule(
      query.group,
      query.moduleSelect,
    );

    const response = allGroup.map((value) => {
      if (query.userSelect) {
        const findUser = value.userPermission.filter(
          (perm) => perm.login === query.userSelect,
        );

        if (findUser.length > 0) {
          return {
            id: value.id,
            name: value.menu.nome,
            permission: {
              access: findUser[0].access === 'Y',
              insert: findUser[0].insert === 'Y',
              delete: findUser[0].delete === 'Y',
              update: findUser[0].update === 'Y',
              export: findUser[0].export === 'Y',
              print: findUser[0].print === 'Y',
            },
          };
        }
      }

      return {
        id: value.id,
        name: value.menu.nome,
        permission: {
          access: value.access === 'Y',
          insert: value.insert === 'Y',
          delete: value.delete === 'Y',
          update: value.update === 'Y',
          export: value.export === 'Y',
          print: value.print === 'Y',
        },
      };
    });

    return {
      [query.type]: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/material-code')
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listSecondaryMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      s: z.string().optional(),
      id: z
        .string()
        .transform((value) =>
          value === '' || value === 'null' ? null : Number(value),
        )
        .optional(),
      index: z.coerce.number().optional(),
    });

    const query = querySchema.parse(req.query);

    const page = 10;

    const data = await this.materialCodeRepository.listByClient(
      user.clientId,
      query.index,
      page,
      query.s && query.s.length > 0
        ? {
            material: {
              tipo: 'stock',
            },
            OR: [
              {
                material: {
                  material: query.s,
                },
              },
              {
                codigo: {
                  contains: query.s,
                },
              },
            ],
          }
        : query.id
        ? {
            id: query.id,
          }
        : null,
    );

    const countItens = await this.materialCodeRepository.countListByClient(
      user.clientId,
      query.s && query.s.length > 0
        ? {
            OR: [
              {
                material: {
                  material: query.s,
                },
              },
              {
                codigo: {
                  contains: query.s,
                },
              },
            ],
          }
        : null,
    );

    const response = data.map((obj) => {
      return {
        value: obj.id.toString(),
        label: `${obj.codigo} - ${obj.material.material}`,
        //stock,
      };
    });

    return {
      data: response,
      totalIndex: Math.ceil(countItens / page) - 1,
    };
  }
}
