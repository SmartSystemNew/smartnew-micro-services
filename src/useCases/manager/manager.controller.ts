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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiExcludeController } from '@nestjs/swagger';
import ImageLoginRepository from 'src/repositories/image-login-repository';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
//import MigrateService from 'src/service/migrate.service';
@ApiExcludeController()
@Controller('/manager')
export default class ManagerController {
  constructor(
    private env: ENVService,
    private fileService: FileService,
    private imageLoginRepository: ImageLoginRepository,
  ) {} //private migrateService: MigrateService

  @Get('/migrate')
  async migrate() {
    //const migrateCompany = await this.migrateService.importCompany();

    return {
      message: 'Banco de Dados migrado com sucesso!',
    };
  }

  @Get('/change-password')
  async changePassword() {
    //const migrateCompany = await this.migrateService.importCompany();

    return {
      message: 'Banco de Dados migrado com sucesso!',
    };
  }

  @Get('/image-login')
  async listAttachment(@Req() req) {
    const querySchema = z.object({
      enable: z.coerce.boolean().nullable().optional(),
    });

    const query = querySchema.parse(req.query);

    const allImage = await this.imageLoginRepository.listImage({
      ...(query.enable && {
        ativo: query.enable ? 1 : 0,
      }),
    });

    const img: {
      url: string;
    }[] = allImage.map((image) => {
      return {
        url: image.url,
      };
    });

    return {
      response: img,
    };
  }

  @Post('/image-login')
  @UseInterceptors(FileInterceptor('file'))
  async postAttachment(@UploadedFile() file: Express.Multer.File) {
    //const migrateCompany = await this.migrateService.importCompany();
    let url = '';
    try {
      const nodes_permission = ['production', 'dev'];
      const path_remote = nodes_permission.includes(this.env.NODE_ENV)
        ? this.env.URL_IMAGE
        : this.env.FILE_PATH;
      const path_local = this.env.FILE_PATH;
      const path_local_img = `${path_local}/login`;
      const path_remote_img = `${path_remote}/login`;
      this.fileService.write(path_local_img, file.originalname, file.buffer);
      url = `${path_remote_img}/${file.originalname}`;

      this.fileService.write(path_local_img, file.originalname, file.buffer);
    } catch (error) {
      console.error(error);
      throw new ConflictException({
        message: MessageService.SYSTEM_FILE_ERROR,
      });
    }

    await this.imageLoginRepository.create({
      nome: file.originalname,
      url,
      ativo: 1,
    });

    return {
      inserted: true,
    };
  }

  @Put('/image-login/:id')
  async updateAttachment(@Req() req, @Param('id') id: string) {
    const bodySchema = z.object({
      enable: z.boolean(),
    });

    const body = bodySchema.parse(req.body);

    const imageLogin = await this.imageLoginRepository.findById(Number(id));

    if (!imageLogin) {
      throw new NotFoundException({
        message: MessageService.SYSTEM_FILE_NOT_FOUND,
      });
    }

    await this.imageLoginRepository.update(imageLogin.id, {
      ativo: body.enable ? 1 : 0,
    });

    return {
      updated: true,
    };
  }

  @Delete('/image-login/:id')
  async deleteAttachment(
    @Body() body: { urlFile: string },
    @Param('id') id: string,
  ) {
    const path = `${this.env.FILE_PATH}/login/${body.urlFile}`;

    this.fileService.delete(path);

    const imageLogin = await this.imageLoginRepository.findById(Number(id));

    if (!imageLogin) {
      throw new NotFoundException({
        message: MessageService.SYSTEM_FILE_NOT_FOUND,
      });
    }

    await this.imageLoginRepository.delete(imageLogin.id);

    return {
      deleted: true,
    };
  }
}
