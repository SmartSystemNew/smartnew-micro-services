import { Controller, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { PermissionRepository } from 'src/repositories/permission-repository';
import UserPermissionRepository from 'src/repositories/user-permission-repository';
import { z } from 'zod';

@ApiTags('Script Case - Permission')
@Controller('/script-case/permission')
export default class PermissionScriptCaseController {
  constructor(
    private permissionRepository: PermissionRepository,
    private userPermissionRepository: UserPermissionRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Put('/update-permission')
  async updateEmission(@Req() req) {
    const bodySchema = z.object({
      user: z.string().nullable().optional(),
      permission: z.array(
        z.object({
          id: z.coerce.number(),
          access: z
            .string()
            .transform((value) => (value === 'true' ? true : false)),
          insert: z
            .string()
            .transform((value) => (value === 'true' ? true : false)),
          delete: z
            .string()
            .transform((value) => (value === 'true' ? true : false)),
          update: z
            .string()
            .transform((value) => (value === 'true' ? true : false)),
          export: z
            .string()
            .transform((value) => (value === 'true' ? true : false)),
          print: z
            .string()
            .transform((value) => (value === 'true' ? true : false)),
        }),
      ),
    });

    const body = bodySchema.parse(req.body);
    // console.log(body);
    for await (const permission of body.permission) {
      if (body.user) {
        await this.userPermissionRepository.update(
          permission.id,
          body.user,
          {
            access: permission.access ? 'Y' : 'N',
            insert: permission.insert ? 'Y' : 'N',
            delete: permission.delete ? 'Y' : 'N',
            update: permission.update ? 'Y' : 'N',
            export: permission.export ? 'Y' : 'N',
            print: permission.print ? 'Y' : 'N',
          },
          {
            id_permissao: permission.id,
            login: body.user,
            access: permission.access ? 'Y' : 'N',
            insert: permission.insert ? 'Y' : 'N',
            delete: permission.delete ? 'Y' : 'N',
            update: permission.update ? 'Y' : 'N',
            export: permission.export ? 'Y' : 'N',
            print: permission.print ? 'Y' : 'N',
          },
        );
      } else {
        await this.permissionRepository.update(permission.id, {
          access: permission.access ? 'Y' : 'N',
          insert: permission.insert ? 'Y' : 'N',
          delete: permission.delete ? 'Y' : 'N',
          update: permission.update ? 'Y' : 'N',
          export: permission.export ? 'Y' : 'N',
          print: permission.print ? 'Y' : 'N',
        });
      }
    }

    return {
      success: true,
    };
  }
}
