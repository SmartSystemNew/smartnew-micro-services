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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import DeletedResponseSwagger from 'src/models/swagger/delete-response';
import InsertedResponseSwagger from 'src/models/swagger/inserted-response';
import UpdatedResponseSwagger from 'src/models/swagger/updated-response';
import MaterialBoundRepository from 'src/repositories/material-bound-repository';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
import MaterialRepository from 'src/repositories/material-repository';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
import CreateMaterialBodySwagger from './dtos/swagger/createMaterial-body-swagger';
import CreateSecondaryCodeMaterialBodySwagger from './dtos/swagger/createSecondaryCodeMaterial-body-swagger';
import findCodeByMaterialIdResponseSwagger from './dtos/swagger/findCodeByMaterialId-response-swagger';
import ListMaterialResponseMaterial from './dtos/swagger/listMaterial-response-swagger';
import ListStockByMaterialResponseSwagger from './dtos/swagger/listStockByMaterial-response-swagger';

@ApiTags('System - Material')
@Controller('system/material')
export default class MaterialSystemController {
  constructor(
    private materialRepository: MaterialRepository,
    private materialCodeRepository: MaterialCodeRepository,
    private fileService: FileService,
    private envService: ENVService,
    private materialBoundRepository: MaterialBoundRepository,
    private materialEstoqueRepository: MaterialEstoqueRepository,
  ) {}

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListMaterialResponseMaterial,
  })
  @Get('/')
  async listMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      index: z.coerce
        .number()
        .transform((value) => (value != null ? value - 1 : null))
        .nullable()
        .optional(),
      perPage: z.coerce.number().nullable().optional(),
      globalFilter: z.string().optional().nullable(),
      code: z.coerce.string().optional().nullable(),
      material: z.coerce.string().optional().nullable(),
      //location: material.material.localizacao,
      location: z.coerce.string().optional().nullable(),
      unity: z.coerce.string().optional().nullable(),
      active: z.coerce.number().optional().nullable(),
      typeMaterial: z.enum(['service', 'stock']).optional().nullable(),
      observation: z.coerce.string().optional().nullable(),
      category: z.array(z.coerce.number()).optional().nullable(),
      brand: z.coerce.string().optional().nullable(),
      classification: z.coerce.number().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const materials = await this.materialCodeRepository.listByClient(
      user.clientId,
      query.index,
      query.perPage,
      {
        AND: [
          {
            ...(query.globalFilter && {
              OR: [
                {
                  codigo: {
                    contains: query.globalFilter,
                  },
                },
                {
                  material: {
                    material: {
                      contains: query.globalFilter,
                    },
                  },
                },
              ],
            }),
          },
          {
            ...(query.code &&
              query.code.length > 0 && {
                codigo: {
                  contains: query.code,
                },
              }),
            ...(query.material &&
              query.material.length > 0 && {
                material: {
                  material: {
                    contains: query.material,
                  },
                },
              }),
            ...(query.location &&
              query.location.length > 0 && {
                material: {
                  localizacao: {
                    contains: query.location,
                  },
                },
              }),
            ...(query.unity &&
              query.unity.length > 0 && {
                material: {
                  unidade: {
                    contains: query.unity,
                  },
                },
              }),
            ...(query.active >= 0 && {
              material: {
                ativo: query.active,
              },
            }),
            ...(query.typeMaterial &&
              query.typeMaterial.length > 0 && {
                material: {
                  tipo: query.typeMaterial,
                },
              }),
            ...(query.observation &&
              query.observation.length > 0 && {
                material: {
                  observacao: {
                    contains: query.observation,
                  },
                },
              }),
            ...(query.category &&
              query.category.length > 0 && {
                material: {
                  categoryMaterial: {
                    id: {
                      in: query.category,
                    },
                  },
                },
              }),
            ...(query.brand &&
              query.brand.length > 0 && {
                marca: {
                  contains: query.brand,
                },
              }),
            ...(query.classification >= 0 && {
              classificacao: query.classification,
            }),
          },
        ],
      },
    );

    const countMaterial = await this.materialCodeRepository.listByClient(
      user.clientId,
      null,
      null,
      {
        AND: [
          {
            ...(query.globalFilter && {
              OR: [
                {
                  codigo: {
                    contains: query.globalFilter,
                  },
                },
                {
                  material: {
                    material: {
                      contains: query.globalFilter,
                    },
                  },
                },
              ],
            }),
          },
          {
            ...(query.code &&
              query.code.length > 0 && {
                codigo: {
                  contains: query.code,
                },
              }),
            ...(query.material &&
              query.material.length > 0 && {
                material: {
                  material: {
                    contains: query.material,
                  },
                },
              }),
            ...(query.location &&
              query.location.length > 0 && {
                material: {
                  localizacao: {
                    contains: query.location,
                  },
                },
              }),
            ...(query.unity &&
              query.unity.length > 0 && {
                material: {
                  unidade: {
                    contains: query.unity,
                  },
                },
              }),
            ...(query.active >= 0 && {
              material: {
                ativo: query.active,
              },
            }),
            ...(query.typeMaterial &&
              query.typeMaterial.length > 0 && {
                material: {
                  tipo: query.typeMaterial,
                },
              }),
            ...(query.observation &&
              query.observation.length > 0 && {
                material: {
                  observacao: {
                    contains: query.observation,
                  },
                },
              }),
            ...(query.category &&
              query.category.length > 0 && {
                material: {
                  categoryMaterial: {
                    id: {
                      in: query.category,
                    },
                  },
                },
              }),
            ...(query.brand &&
              query.brand.length > 0 && {
                marca: {
                  contains: query.brand,
                },
              }),
            ...(query.classification >= 0 && {
              classificacao: query.classification,
            }),
          },
        ],
      },
    );

    const allMaterialsSecondStock =
      materials.length > 0
        ? await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            materials.map((value) => value.id),
          )
        : [];

    const classification = {
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada',
    };

    const response = materials.map((material) => {
      const findSecond = allMaterialsSecondStock.find(
        (second) => second.id === material.id,
      );

      const stock = findSecond ? findSecond.entrada - findSecond.saida : 0;

      const reserve = findSecond ? findSecond.reserva : 0;

      const stockPhysical = stock - reserve;

      return {
        id: material.material.id,
        code: material.material.tipo === 'service' ? null : material.codigo,
        material: material.material.material,
        //location: material.material.localizacao,
        location: material.material?.location?.localizacao || null,
        unity: material.material.unidade,
        user: material.material.log_user,
        active: material.material.ativo === 1,
        typeMaterial: material.material.tipo,
        observation: material.material.observacao,
        category: material.material.categoryMaterial
          ? {
              id: material.material.categoryMaterial.id,
              description: material.material.categoryMaterial.descricao,
            }
          : null,
        additional: {
          ncm_code: material.material.codigo_ncm,
          with_branch: material.material.branch != null,
          branch: material.material.branch
            ? {
                id: material.material.branch.ID,
                name: material.material.branch.razao_social,
              }
            : null,
        },
        minStorage: material?.estoque_min || null,
        maxStorage: material?.estoque_max || null,
        brand: material.marca,
        classification: material.classificacao
          ? classification[material.classificacao]
          : null,
        stockPhysical,
      };
    });

    return {
      data: response,
      totalItems: countMaterial.length,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListMaterialResponseMaterial,
  })
  @ApiOperation({
    summary: 'Listar Material (Serviço)',
    description: 'Rota de Buscar Materiais (Serviço)',
  })
  @Get('/service')
  async listMaterialService(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      index: z.coerce
        .number()
        .transform((value) => (value != null ? value - 1 : null))
        .nullable()
        .optional(),
      perPage: z.coerce.number().nullable().optional(),
      globalFilter: z.string().optional().nullable(),
      code: z.coerce.string().optional().nullable(),
      material: z.coerce.string().optional().nullable(),
      //location: material.material.localizacao,
      location: z.coerce.string().optional().nullable(),
      unity: z.coerce.string().optional().nullable(),
      active: z.coerce.number().optional().nullable(),
      typeMaterial: z.enum(['service', 'stock']).optional().nullable(),
      observation: z.coerce.string().optional().nullable(),
      category: z.array(z.coerce.number()).optional().nullable(),
      brand: z.coerce.string().optional().nullable(),
      classification: z.coerce.number().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const materials = await this.materialRepository.listByClientAndActive(
      user.clientId,
      {
        tipo: 'service',
        AND: [
          {
            ...(query.globalFilter && {
              OR: [
                {
                  codigo: {
                    contains: query.globalFilter,
                  },
                },
                {
                  material: {
                    contains: query.globalFilter,
                  },
                },
              ],
            }),
          },
          {
            ...(query.code &&
              query.code.length > 0 && {
                codigo: {
                  contains: query.code,
                },
              }),
            ...(query.material &&
              query.material.length > 0 && {
                material: {
                  contains: query.material,
                },
              }),
            ...(query.location &&
              query.location.length > 0 && {
                localizacao: {
                  contains: query.location,
                },
              }),
            ...(query.unity &&
              query.unity.length > 0 && {
                unidade: {
                  contains: query.unity,
                },
              }),
            ...(query.active >= 0 && {
              ativo: query.active,
            }),
            ...(query.typeMaterial &&
              query.typeMaterial.length > 0 && {
                tipo: query.typeMaterial,
              }),
            ...(query.observation &&
              query.observation.length > 0 && {
                observacao: {
                  contains: query.observation,
                },
              }),
            ...(query.category &&
              query.category.length > 0 && {
                categoryMaterial: {
                  id: {
                    in: query.category,
                  },
                },
              }),
          },
        ],
      },
      query.index,
      query.perPage,
    );

    const countMaterial =
      await this.materialRepository.countListByClientAndActive(user.clientId, {
        tipo: 'service',
        AND: [
          {
            ...(query.globalFilter && {
              OR: [
                {
                  codigo: {
                    contains: query.globalFilter,
                  },
                },
                {
                  material: {
                    contains: query.globalFilter,
                  },
                },
              ],
            }),
          },
          {
            ...(query.code &&
              query.code.length > 0 && {
                codigo: {
                  contains: query.code,
                },
              }),
            ...(query.material &&
              query.material.length > 0 && {
                material: {
                  contains: query.material,
                },
              }),
            ...(query.location &&
              query.location.length > 0 && {
                localizacao: {
                  contains: query.location,
                },
              }),
            ...(query.unity &&
              query.unity.length > 0 && {
                unidade: {
                  contains: query.unity,
                },
              }),
            ...(query.active >= 0 && {
              ativo: query.active,
            }),
            ...(query.typeMaterial &&
              query.typeMaterial.length > 0 && {
                tipo: query.typeMaterial,
              }),
            ...(query.observation &&
              query.observation.length > 0 && {
                observacao: {
                  contains: query.observation,
                },
              }),
            ...(query.category &&
              query.category.length > 0 && {
                categoryMaterial: {
                  id: {
                    in: query.category,
                  },
                },
              }),
          },
        ],
      });

    const response = materials.map((material) => {
      return {
        id: material.id,
        code: material.tipo === 'service' ? null : material.codigo,
        material: material.material,
        //location: material.localizacao,
        location: material?.location?.localizacao || null,
        unity: material.unidade,
        user: material.log_user,
        active: material.ativo === 1,
        typeMaterial: material.tipo,
        observation: material.observacao,
        category: material.categoryMaterial
          ? {
              id: material.categoryMaterial.id,
              description: material.categoryMaterial.descricao,
            }
          : null,
        additional: {
          ncm_code: material.codigo_ncm,
          with_branch: material.branch != null,
          branch: material.branch
            ? {
                id: material.branch.ID,
                name: material.branch.razao_social,
              }
            : null,
        },
      };
    });

    return {
      data: response,
      totalItems: countMaterial,
    };
  }

  @Get('/list-type-material')
  async listTypeMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      index: z.coerce
        .number()
        .transform((value) => (value != null ? value - 1 : null))
        .nullable()
        .optional(),
      perPage: z.coerce.number().nullable().optional(),
      globalFilter: z.string().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const materials = await this.materialCodeRepository.listByClient(
      user.clientId,
      query.index,
      query.perPage,
      {
        AND: [
          {
            ...(query.globalFilter && {
              OR: [
                {
                  codigo: {
                    contains: query.globalFilter,
                  },
                },
                {
                  material: {
                    material: {
                      contains: query.globalFilter,
                    },
                  },
                },
              ],
            }),
          },
        ],
      },
    );

    const countMaterial = await this.materialCodeRepository.listByClient(
      user.clientId,
      null,
      null,
      {
        AND: [
          {
            ...(query.globalFilter && {
              OR: [
                {
                  codigo: {
                    contains: query.globalFilter,
                  },
                },
                {
                  material: {
                    material: {
                      contains: query.globalFilter,
                    },
                  },
                },
              ],
            }),
          },
        ],
      },
    );

    const allMaterialsSecondStock =
      materials.length > 0
        ? await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            materials.map((value) => value.id),
          )
        : [];

    const classification = {
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada',
    };

    const response = materials.map((material) => {
      const findSecond = allMaterialsSecondStock.find(
        (second) => second.id === material.id,
      );

      const stock = findSecond ? findSecond.entrada - findSecond.saida : 0;

      const reserve = findSecond ? findSecond.reserva : 0;

      const stockPhysical = stock - reserve;

      return {
        id: material.material.id,
        code: material.material.tipo === 'service' ? null : material.codigo,
        location: material.material.localizacao,
        unity: material.material.unidade,
        user: material.material.log_user,
        active: material.material.ativo === 1,
        typeMaterial: material.material.tipo,
        observation: material.material.observacao,
        category: material.material.categoryMaterial
          ? {
              id: material.material.categoryMaterial.id,
              description: material.material.categoryMaterial.descricao,
            }
          : null,
        additional: {
          ncm_code: material.material.codigo_ncm,
          with_branch: material.material.branch != null,
          branch: material.material.branch
            ? {
                id: material.material.branch.ID,
                name: material.material.branch.razao_social,
              }
            : null,
        },
        minStorage: material?.estoque_min || null,
        maxStorage: material?.estoque_max || null,
        brand: material.marca,
        classification: material.classificacao
          ? classification[material.classificacao]
          : null,
        stockPhysical,
      };
    });

    return {
      data: response,
      totalItems: countMaterial.length,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateMaterialBodySwagger,
  })
  @ApiResponse({
    type: InsertedResponseSwagger,
  })
  @Post('/')
  async createMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      branch: z.coerce.number().nullable(),
      material: z.string(),
      category: z.coerce.number().nullable(),
      unity: z.string().nullable(),
      location: z.string().nullable(),
      type_material: z.enum(['stock', 'service']).nullable(),
      observation: z.string().nullable(),
      ncm_code: z.number().nullable(),
      withBranch: z.coerce.boolean().nullable(),
      locationId: z.coerce.number().optional().nullable(),
      secondaryCode: z
        .array(
          z.object({
            code: z.string(),
            brand: z.string(),
            specification: z.string(),
            rating: z.coerce.number(),
            min_storage: z
              .number()
              .min(1, {
                message: 'Valor mínimo inválido!',
              })
              .default(1)
              .optional()
              .nullable(),
            max_storage: z
              .number()
              .min(1, {
                message: 'Valor máximo inválido!',
              })
              .default(1)
              .optional()
              .nullable(),
          }),
        )
        .optional()
        .nullable(),
    });

    const body = bodySchema.parse(req.body);

    const validDuplicate =
      await this.materialRepository.findByClientAndCodeAndMaterial(
        user.clientId,
        body.material
          .split(' ')
          .map((word) => word.slice(0, 2))
          .join(''),
        body.material,
      );

    if (validDuplicate) {
      throw new ConflictException(
        MessageService.Material_code_and_material_found,
      );
    }

    if (body.type_material === 'stock' && !body.secondaryCode) {
      throw new ConflictException(
        MessageService.Material_code_secondary_is_required,
      );
    }

    if (body.type_material === 'service') {
      body.secondaryCode = [
        {
          code: body.material
            .split(' ')
            .map((word) => word.slice(0, 2))
            .join(''),
          brand: '',
          specification: '',
          rating: 1,
        },
      ];
    }

    const material = await this.materialRepository.create({
      id_cliente: user.clientId,
      codigo: body.material
        .split(' ')
        .map((word) => word.slice(0, 2))
        .join(''),
      material: body.material,
      valor: 1.0,
      Valor_venda: 1.0,
      codigo_ncm: body.ncm_code,
      id_categoria: body.category,
      tipo: body.type_material,
      // estoque_min: body.min_storage,
      // estoque_max: body.max_storage,
      localizacao: body.location,
      unidade: body.unity,
      observacao: body.observation,
      ativo: 1,
      id_filial: body.withBranch ? body.branch : null,
      log_user: user.login,
      id_localizacao: body.locationId,
      materialCode: {
        createMany: {
          data: body.secondaryCode.map((code) => ({
            id_cliente: user.clientId,
            codigo: code.code,
            marca: code.brand,
            especificacao: code.specification,
            classificacao: code.rating,
            estoque_min: code.min_storage,
            estoque_max: code.max_storage,
          })),
        },
      },
    });

    return {
      inserted: true,
      id: material.id,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListMaterialResponseMaterial,
  })
  @Get('/:id')
  async findById(@Param('id') id: string) {
    const material = await this.materialRepository.findById(Number(id));

    const response = {
      id: material.id,
      code:
        material.materialCode.length > 0
          ? material.materialCode[0].codigo
          : null,
      material: material.material,
      location: material.localizacao,
      unity: material.unidade,
      min: material.estoque_min,
      max: material.estoque_max,
      active: material.ativo === 1,
      typeMaterial: material.tipo,
      observation: material.observacao,
      category: material.categoryMaterial
        ? {
            id: material.categoryMaterial.id,
            description: material.categoryMaterial.descricao,
          }
        : null,
      additional: {
        ncm_code: material.codigo_ncm,
        secondary_code: material.codigo_secundario,
        with_branch: material.branch != null,
        branch: material.branch
          ? {
              id: material.branch.ID,
              name: material.branch.razao_social,
            }
          : null,
      },
      secondaryCode: material.materialCode.map((code) => {
        return {
          id: code.id,
          code: code.codigo,
          classification: code.classificacao,
          specification: code.especificacao,
          manufacture: code.marca,
        };
      }),
    };

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id/secondary-code')
  async listMaterialBySecondaryCode(
    @Req() req,
    @Param('id') materialId: number,
  ) {
    const user: IUserInfo = req.user;

    const material = await this.materialRepository.findById(Number(materialId));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    if (material.tipo === 'service') {
      return {
        data: [],
      };
    }

    const materialCode = await this.materialCodeRepository.lisByMaterialAndCode(
      Number(materialId),
    );

    const allMaterialsSecondStock =
      materialCode.length > 0
        ? await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            materialCode.map((value) => value.id),
          )
        : [];

    const response = [];

    const classification = {
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada',
    };

    for await (const value of materialCode) {
      const findSecond = allMaterialsSecondStock.find(
        (second) => second.id === value.id,
      );

      const stock = findSecond ? findSecond.entrada - findSecond.saida : 0;

      const reserve = findSecond ? findSecond.reserva : 0;

      const stockPhysical = stock - reserve;

      response.push({
        id: value.id,
        code: value.codigo,
        specification: value.especificacao,
        classificationId: value.classificacao,
        classification: value.classificacao
          ? classification[value.classificacao]
          : null,
        manufacture: value.marca,
        quantity: stockPhysical,
        min_storage: value.estoque_min,
        max_storage: value.estoque_max,
      });
    }

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateMaterialBodySwagger,
  })
  @ApiResponse({
    type: UpdatedResponseSwagger,
  })
  @Put('/:id')
  async updateMaterial(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      branch: z.coerce.number().nullable().optional(),
      // code: z.string(),
      material: z.string(),
      category: z.coerce.number().nullable(),
      unity: z.string().nullable(),
      location: z.string().nullable().optional(),
      locationId: z.coerce.number().optional().nullable(),
      // type_material: z.enum(['stock', 'service']).nullable(),
      // min_storage: z.number().min(1),
      observation: z.string().nullable(),
      // max_storage: z.number().min(1),
      ncm_code: z.number().nullable(),
      active: z.coerce.boolean().nullable().default(true),
      withBranch: z.coerce.boolean().nullable(),
      // secondary_codes: z
      //   .array(
      //     z.object({
      //       id: z.coerce.number().nullable(),
      //       code: z.string(),
      //       manufacture: z.string().nullable(),
      //       specification: z.string().nullable(),
      //       classification: z.number().nullable(),
      //       min_storage: z.number().min(1).default(1).optional().nullable(),
      //       max_storage: z.number().min(1).default(1).optional().nullable(),
      //     }),
      //   )
      //   .nullable()
      //   .optional(),
    });

    const body = bodySchema.parse(req.body);

    const material = await this.materialRepository.findById(Number(id));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    await this.materialRepository.update(material.id, {
      id_cliente: user.clientId,
      //codigo: body.material,
      material: body.material,
      codigo_ncm: body.ncm_code,
      id_categoria: body.category,
      //tipo: body.type_material,
      // estoque_min: body.min_storage,
      // estoque_max: body.max_storage,
      localizacao: body.location,
      id_localizacao: body.locationId,
      unidade: body.unity,
      observacao: body.observation,
      ativo: body.active ? 1 : 0,
      id_filial: body.withBranch ? body.branch : null,
      // materialCode: body.secondary_codes
      //   ? {
      //       createMany: {
      //         data: body.secondary_codes
      //           ?.filter((value) => value.id === null)
      //           .map((value) => {
      //             return {
      //               id_cliente: user.clientId,
      //               codigo: value.code,
      //               classificacao: value.classification,
      //               especificacao: value.specification,
      //               marca: value.manufacture,
      //             };
      //           }),
      //       },
      //       updateMany: body.secondary_codes
      //         ?.filter((value) => value.id)
      //         .map((value) => {
      //           return {
      //             data: {
      //               codigo: value.code,
      //               classificacao: value.classification,
      //               especificacao: value.specification,
      //               marca: value.manufacture,
      //             },
      //             where: {
      //               id: value.id,
      //             },
      //           };
      //         }),
      //     }
      //   : {},
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: DeletedResponseSwagger,
  })
  @Delete('/:id')
  async deleteMaterial(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const material = await this.materialRepository.findMaterialAndBound(
      Number(id),
    );

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    const allMaterialsSecondStock =
      await this.materialRepository.listStockCodeSecond(
        user.clientId,
        null,
        null,
        [material.id],
      );

    if (allMaterialsSecondStock.length > 0) {
      throw new ConflictException({
        message: MessageService.Material_not_delete_have_stock,
      });
    }

    if (material.itemForMaterial.length > 0) {
      throw new ConflictException({
        message: MessageService.Material_not_delete_have_buy,
      });
    }

    if (material.materialPlanPrev.length > 0) {
      throw new ConflictException({
        message: MessageService.Material_not_delete_have_plan,
      });
    }

    if (material.materialServiceOrder.length > 0) {
      throw new ConflictException({
        message: MessageService.Material_not_delete_have_order_service,
      });
    }

    if (material.materialSuppliers.length > 0) {
      throw new ConflictException({
        message: MessageService.Material_not_delete_have_suppliers,
      });
    }

    await this.materialRepository.delete(material.id);

    return {
      deleted: true,
    };
  }

  @ApiResponse({
    type: ListStockByMaterialResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/:id/stock')
  async listStockByMaterial(@Param('id') id: string) {
    const material = await this.materialRepository.findById(Number(id));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    // Agrupe as entradas e saídas por preço
    const groupedStockIn = material.stockIn.reduce((acc, item) => {
      acc[Number(item.valor_unitario)] =
        (acc[Number(item.valor_unitario)] || 0) + Number(item.quantidade);
      return acc;
    }, {});

    const groupedMaterialServiceOrder = material.materialServiceOrder.reduce(
      (acc, item) => {
        acc[Number(item.valor_unidade)] =
          (acc[Number(item.valor_unidade)] || 0) + Number(item.quantidade);
        return acc;
      },
      {},
    );

    // Calcule o estoque atual por preço
    const stock = Object.keys(groupedStockIn).map((price) => {
      const stockIn = groupedStockIn[price] || 0;
      const stockOut = groupedMaterialServiceOrder[price] || 0;

      return {
        price: Number(price),
        quantity: stockIn - stockOut,
      };
    });

    return {
      stock,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: findCodeByMaterialIdResponseSwagger,
  })
  @Get('/:id/code')
  async findCodeByMaterialId(@Param('id') id: string) {
    const material = await this.materialRepository.findById(Number(id));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    return {
      data: material.materialCode.map((value) => {
        return {
          id: value.id,
          code: value.codigo,
          brand: value.marca,
          specification: value.especificacao,
          rating: value.classificacao,
          min_storage: value.estoque_min,
          max_storage: value.estoque_max,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: InsertedResponseSwagger,
  })
  @Post('/:id/code')
  async createSecondaryCodeMaterial(
    @Req() req,
    @Param('id') id: string,
    @Body() body: CreateSecondaryCodeMaterialBodySwagger,
  ) {
    const user: IUserInfo = req.user;

    const material = await this.materialRepository.findById(Number(id));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    const findDuplicate =
      await this.materialCodeRepository.findDuplicateByMaterial(
        material.id,
        body.code,
      );

    if (findDuplicate) {
      throw new ConflictException(
        MessageService.Material_code_secondary_duplicate,
      );
    }

    const materialCode = await this.materialCodeRepository.create({
      id_cliente: user.clientId,
      id_material: material.id,
      codigo: body.code,
      marca: body.brand,
      especificacao: body.specification,
      classificacao: body.rating,
      estoque_min: body.min_storage,
      estoque_max: body.max_storage,
    });

    return {
      inserted: true,
      id: materialCode.id,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: UpdatedResponseSwagger,
  })
  @Put('/:id/code/:codeId')
  async updateSecondaryCodeMaterial(
    @Param('id') id: string,
    @Param('codeId') codeId: string,
    @Body() body: CreateSecondaryCodeMaterialBodySwagger,
  ) {
    const material = await this.materialRepository.findById(Number(id));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    const materialCode = await this.materialCodeRepository.findById(
      Number(codeId),
    );

    if (!materialCode) {
      throw new NotFoundException(MessageService.Material_code_not_found);
    }

    const ifExist = await this.materialCodeRepository.MaterialExistInMaterial(
      material.id,
      body.code,
      materialCode.id,
    );

    if (ifExist) {
      throw new ConflictException(MessageService.Name_material_exist);
    }

    await this.materialCodeRepository.update(materialCode.id, {
      codigo: body.code,
      marca: body.brand,
      especificacao: body.specification,
      classificacao: body.rating,
      estoque_min: body.min_storage,
      estoque_max: body.max_storage,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: DeletedResponseSwagger,
  })
  @Delete('/:id/code/:codeId')
  async deleteSecondaryCodeMaterial(
    @Param('id') id: string,
    @Param('codeId') codeId: string,
  ) {
    const material = await this.materialRepository.findById(Number(id));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    const materialCode = await this.materialCodeRepository.findById(
      Number(codeId),
    );

    if (!materialCode) {
      throw new NotFoundException(MessageService.Material_code_not_found);
    }

    const allCode = await this.materialCodeRepository.listByMaterial(
      material.id,
    );

    if (allCode.length === 1) {
      throw new ConflictException(
        MessageService.Material_code_secondary_last_one,
      );
    }

    await this.materialCodeRepository.delete(materialCode.id);

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id/code/:codeId/attach')
  async listAttachmentByCode(
    @Param('id') id: string,
    @Param('codeId') codeId: string,
  ) {
    const response: {
      img: { url: string }[];
      errorImg?: { message: string };
    } = {
      img: [],
    };

    try {
      const material = await this.materialRepository.findById(Number(id));

      if (!material) {
        throw new NotFoundException(MessageService.Material_id_not_found);
      }

      const materialCode = await this.materialCodeRepository.findById(
        Number(codeId),
      );

      if (!materialCode) {
        throw new NotFoundException(MessageService.Material_code_not_found);
      }

      const path = `${this.envService.FILE_PATH}/material/id_${id}/code_${codeId}/`;

      const fileList = this.fileService.list(path);

      fileList.forEach((fileItem) => {
        response.img.push({
          url: `${this.envService.URL_IMAGE}/material/id_${id}/code_${codeId}/${fileItem}`,
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

  @Post('/:id/code/:codeId/attach')
  @UseInterceptors(FileInterceptor('file'))
  async insertAttach(
    @Param('id') id: string,
    @Param('codeId') codeId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const material = await this.materialRepository.findById(Number(id));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    const materialCode = await this.materialCodeRepository.findById(
      Number(codeId),
    );

    if (!materialCode) {
      throw new NotFoundException(MessageService.Material_code_not_found);
    }

    const path = `${this.envService.FILE_PATH}/material/id_${id}/code_${codeId}/`;

    this.fileService.write(path, file.originalname, file.buffer);

    return {
      insert: true,
      url: `${this.envService.URL_IMAGE}/material/id_${id}/code_${codeId}/${file.originalname}`,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/code/:codeId/attach')
  async deleteAttach(
    @Param('id') id: string,
    @Param('codeId') codeId: string,
    @Body() body: { urlFile: string },
  ) {
    const path = `${this.envService.FILE_PATH}/material/id_${id}/code_${codeId}/${body.urlFile}`;

    this.fileService.delete(path);

    return {
      delete: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id/code/bound')
  async listStockByCode(@Param('id') id: string) {
    const material = await this.materialRepository.findById(Number(id));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    const materialBound = await this.materialBoundRepository.findByMaterial(
      material.id,
    );

    const response = materialBound.map((bound) => {
      return {
        id: bound.id,
        equipment: bound.equipment.equipamento_codigo,
        manufacturer: bound.equipment.fabricante,
        model: bound.equipment.modelo,
        serialNumber: bound.equipment.n_serie,
        purchaseDate: bound.equipment.ano_fabricacao,
        plate: bound.equipment.placa,
      };
    });

    return response;
  }

  @UseGuards(AuthGuard)
  @Post('/:id/code/bound')
  async createBound(@Param('id') id: string, @Req() req) {
    const bodySchema = z.object({
      equipmentIds: z.array(z.number()),
    });

    const body = bodySchema.parse(req.body);

    const material = await this.materialRepository.findById(Number(id));

    if (!material) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    for await (const equipmentId of body.equipmentIds) {
      await this.materialBoundRepository.create({
        id_material: material.id,
        id_equipamento: equipmentId,
      });
    }

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/code/bound/:boundId')
  async deleteBound(@Param('boundId') boundId: string) {
    await this.materialBoundRepository.delete(Number(boundId));

    return {
      deleted: true,
    };
  }
}
