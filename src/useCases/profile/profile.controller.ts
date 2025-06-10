import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { LoginRepository } from 'src/repositories/login-repository';
import { ModuleRepository } from 'src/repositories/module-repository';
import { UserRepository } from 'src/repositories/user-repository';
import { MessageService } from 'src/service/message.service';
import { IProfileResponse } from './dtos/profile-response';
import { MenuRepository } from 'src/repositories/menu-repository';
import { buildTreeMenu, formatMenu } from 'src/service/function.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';
import { IUserInfo } from 'src/models/IUser';
import ConfigTableRepository from 'src/repositories/config-table-repository';
import CreateLayoutTableBodySwagger from './dtos/createLayoutTable-body-swagger';
import ListLayoutTableResponseSwagger from './dtos/listLayoutTable-response-swagger';
import InsertedResponseSwagger from 'src/models/swagger/inserted-response';
import UpdatedResponseSwagger from 'src/models/swagger/updated-response';
import DeletedResponseSwagger from 'src/models/swagger/delete-response';
import ListLayoutTableQuerySwagger from './dtos/listLayoutTable-query-swagger';
import UpdateLayoutTableBodySwagger from './dtos/updateLayoutTable-body-swagger';

@ApiTags('Profile')
@Controller('/profile')
export class ProfileController {
  constructor(
    private loginRepository: LoginRepository,
    private moduleRepository: ModuleRepository,
    private userRepository: UserRepository,
    private menuRepository: MenuRepository,
    private configTableRepository: ConfigTableRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async profile(@Request() req): Promise<IProfileResponse> {
    const user = await this.loginRepository.findLogin(req.user.login);

    if (!user) {
      throw new UnauthorizedException(MessageService.Credential_invalid);
    }

    const group = await this.userRepository.findGroup(user.login);

    //console.log(group);

    const allMenu = await this.menuRepository.listMenuAndPermissionByGroup(
      group.group_id,
      {
        id_modulo: {
          notIn: [2, 8, 10],
        },
      },
    );

    //console.log(allMenu);

    const menu = {
      module: [],
    };

    allMenu.forEach((application) => {
      // if (application.status !== 'ATIVO') {
      //   return;
      // }

      // if (!group.group.groupModule.find((item) => item.module.id === 5)) {
      //   return;
      // }

      // if (
      //   application.module.id === 5 &&
      //   group.group.groupModule.find((item) => item.module.id === 5)
      //     .priv_access !== 'Y'
      // ) {
      //   return;
      // }

      //if (application.module.id === 1) console.log(application);

      let index = menu.module.findIndex(
        (module) => module.id === application.module.id,
      );

      //console.log('index => ', index);

      if (index < 0) {
        menu.module.push({
          id: application.module.id,
          name: application.module.nome,
          icon: application.module.icone,
          order: application.module.ordem,
          access: application.module.clientes.includes(
            user.id_cliente.toString(),
          ),
          menu: [],
          react: application.module.react_endpoint,
        });

        index = menu.module.length - 1;
      }
      //console.log('menu module =>', menu);

      // const hasFather = application.id_pai;

      // let indexMenu = null;

      // if (hasFather !== 0) {
      //   indexMenu = menu.module[index].menu.findIndex(
      //     (current) => current.value === hasFather,
      //   );
      // }

      const permission = {
        access: null,
        update: null,
        delete: null,
        export: null,
        print: null,
      };

      if (application.permission.length) {
        const indexModel = application.permission.findIndex(
          (value) => value.module.id === menu.module[index].id,
        );

        if (indexModel >= 0) {
          const indexPermissionUser = application.permission[
            indexModel
          ].userPermission.findIndex(
            (value) => value.users.login === user.login,
          );

          if (indexPermissionUser >= 0) {
            permission.access =
              application.permission[indexModel].userPermission[
                indexPermissionUser
              ].access === 'Y';
            permission.update =
              application.permission[indexModel].userPermission[
                indexPermissionUser
              ].update === 'Y';
            permission.delete =
              application.permission[indexModel].userPermission[
                indexPermissionUser
              ].delete === 'Y';
            permission.export =
              application.permission[indexModel].userPermission[
                indexPermissionUser
              ].export === 'Y';
            permission.print =
              application.permission[indexModel].userPermission[
                indexPermissionUser
              ].print === 'Y';
          } else {
            permission.access =
              application.permission[indexModel].access === 'Y';
            permission.update =
              application.permission[indexModel].update === 'Y';
            permission.delete =
              application.permission[indexModel].delete === 'Y';
            permission.export =
              application.permission[indexModel].export === 'Y';
            permission.print = application.permission[indexModel].print === 'Y';
          }
        }
      }

      // if (indexMenu !== null && indexMenu >= 0) {
      //   const screen = {
      //     value: application.id,
      //     application: application.aplicacao,
      //     icon: application.icone,
      //     iconeReact: application.icone_react,
      //     label: application.nome,
      //     order: Number(application.ordem),
      //     access: permission.access ?? null,
      //     permission,
      //     children: null,
      //   };

      //   menu.module[index].menu[indexMenu].children.push(screen);
      //   menu.module[index].menu[indexMenu].children.sort(
      //     (a, b) => a.order - b.order,
      //   );
      // } else {
      //   const screen = {
      //     value: application.id,
      //     application: application.aplicacao,
      //     icon: application.icone,
      //     iconeReact: application.icone_react,
      //     label: application.nome,
      //     access: permission.access ?? null,
      //     order: Number(application.ordem),
      //     permission,
      //     children: [],
      //   };

      //   menu.module[index].menu.push(screen);
      // }

      // const screen = {
      //   value: application.id,
      //   application: application.aplicacao,
      //   icon: application.icone,
      //   iconeReact: application.icone_react,
      //   label: application.nome,
      //   order: Number(application.ordem),
      //   access: permission.access ?? null,
      //   permission,
      //   children: null,
      // };
      // if (application.id === 449) {
      //   console.log(application);
      //   console.log(application.permission);
      //   console.log(permission);
      // }

      const screen = {
        id: application.id,
        id_pai: application.id_pai,
        icone: application.icone,
        icone_react: application.icone_react,
        nome: application.nome,
        aplicacao: application.aplicacao,
        ordem: Number(application.ordem),
        versao: application.versao,
        permission,
      };

      menu.module[index].menu.push(screen);

      menu.module[index].menu.sort((a, b) => a.order - b.order);
    });

    menu.module.forEach((value) => {
      value.menu = buildTreeMenu(value.menu).map((menu) => {
        return formatMenu(menu);
      });
    });

    menu.module.sort((a, b) => a.order - b.order);

    return {
      user: {
        login: user.login,
        name: user.name,
        clientId: user.id_cliente,
        companies: user.managerUserBound.map((value) => {
          return {
            id: value.companyBound.ID,
            name: value.companyBound.nome_fantasia,
            cnpj: value.companyBound.cnpj,
          };
        }),
        group: !group
          ? ''
          : {
              description: group.group.description,
              id: group.group_id,
            },
      },
      //modules: moduleUser,
      modules: menu.module,
      // .filter((value) =>
      //   user.login !== 'bruno.matias' ? value.id > 0 : value.id !== 5,
      // ),
    };
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lista Layouts Tabelas',
    description: 'Retorna as configurações dos layouts de tabelas',
  })
  @ApiQuery({
    type: ListLayoutTableQuerySwagger,
  })
  @ApiOkResponse({
    type: ListLayoutTableResponseSwagger,
  })
  @Get('/layout-table')
  async listLayoutTable(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      screenName: z.string(),
      tableName: z.string(),
    });

    const query = querySchema.parse(req.query);

    const layoutCompany = await this.configTableRepository.findByClientOnly(
      user.clientId,
      {
        nome_tela: query.screenName,
        nome_tabela: query.tableName,
      },
    );

    const layoutUser = await this.configTableRepository.findByUserOnly(
      user.clientId,
      user.login,
      {
        nome_tela: query.screenName,
        nome_tabela: query.tableName,
      },
    );

    let response = null;

    if (layoutUser) {
      response = layoutUser.configuracao;
    } else if (layoutCompany) {
      response = layoutCompany.configuracao;
    }

    if (response === null) {
      return {
        config: null,
      };
    }

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Criar Layout Tabela',
    description: 'Cria a configuração do layout de uma tabela',
  })
  @ApiBody({
    type: CreateLayoutTableBodySwagger,
  })
  @ApiCreatedResponse({
    type: InsertedResponseSwagger,
  })
  @Post('/layout-table')
  async createLayoutTable(@Req() req) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      screenName: z.string(),
      tableName: z.string(),
      config: z.object({
        columns: z.array(
          z.object({
            id: z.string(),
            position: z.number(),
            visible: z.boolean(),
          }),
        ),
      }),
    });

    const body = bodySchema.parse(req.body);

    const findConfig = await this.configTableRepository.listByClient(
      user.clientId,
      {
        OR: [
          {
            nome_tabela: body.tableName,
            nome_tela: body.screenName,
            user: user.login,
          },
          {
            nome_tabela: body.tableName,
            nome_tela: body.screenName,
            user: null,
          },
        ],
      },
    );

    if (findConfig.length > 0) {
      await this.configTableRepository.update(findConfig[0].id, {
        configuracao: { config: body.config },
      });
    } else {
      await this.configTableRepository.create({
        id_cliente: user.clientId,
        nome_tabela: body.tableName,
        nome_tela: body.screenName,
        user: user.login,
        configuracao: { config: body.config },
        log_user: user.login,
      });
    }

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Atualizar Layout Tabela',
    description: 'Atualiza a configuração do layout de uma tabela',
  })
  @ApiBody({
    type: UpdateLayoutTableBodySwagger,
  })
  @ApiOkResponse({
    type: UpdatedResponseSwagger,
  })
  @Put('/layout-table/:id')
  async updateLayoutTable(@Req() req, @Param('id') id: string) {
    const bodySchema = z.object({
      screenName: z.string(),
      tableName: z.string(),
      config: z.object({
        columns: z.array(
          z.object({
            id: z.string(),
            position: z.number(),
            visible: z.boolean(),
          }),
        ),
      }),
    });

    const body = bodySchema.parse(req.body);

    const layout = await this.configTableRepository.findById(Number(id));

    if (!layout) {
      throw new NotFoundException({
        message: MessageService.Profile_layout_table_not_found,
      });
    }

    await this.configTableRepository.update(layout.id, {
      nome_tabela: body.tableName,
      nome_tela: body.screenName,
      configuracao: { config: body.config },
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Deletar Layout Tabela',
    description: 'Deleta a configuração do layout de uma tabela',
  })
  @ApiOkResponse({
    type: DeletedResponseSwagger,
  })
  @Delete('/layout-table/:id')
  async deleteLayoutTable(@Param('id') id: string) {
    const layout = await this.configTableRepository.findById(Number(id));

    if (!layout) {
      throw new NotFoundException({
        message: MessageService.Profile_layout_table_not_found,
      });
    }

    await this.configTableRepository.delete(layout.id);

    return {
      deleted: true,
    };
  }
}
