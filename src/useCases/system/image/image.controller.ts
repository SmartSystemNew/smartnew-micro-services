import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import FindImageQuery from './dtos/findImage-query';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';

@ApiExcludeController()
@Controller('system/image')
export default class ImageController {
  constructor(
    private envService: ENVService,
    private fileService: FileService,
  ) {}
  @Get('/')
  async findImage(@Res() res, @Query() query: FindImageQuery) {
    try {
      const response = this.fileService.find(
        `${this.envService.FILE_PATH}/${query.url}`,
      );

      if (!response) {
        throw new Error('Imagem não encontrada');
      }

      const path = '/var/www/sistemas/_lib/img';

      res.sendFile(`${path}/${query.url}`);
    } catch (error) {
      const imageUrl = `${this.envService.URL_IMAGE}/${query.url}`;
      console.log('Buscando imagem:', imageUrl);
      console.error('Erro ao buscar a imagem:', error.message);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Erro ao buscar a imagem');
    }
  }
}
