import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MessageService } from './message.service';

interface IENVSERVICE {
  PORT: number;
  URL: string;
  NODE_ENV: string | 'dev' | 'production' | 'teste' | 'docker';
  ORIGIN: string;
  KEY: string;
  DATABASE_URL: string;
  FTP_HOST: string;
  FTP_USER: string;
  FTP_PASS: string;
  FILE_PATH: string;
  FILE_IMPORT: string;
  URL_IMAGE: string;
}

@Injectable()
export class ENVService implements IENVSERVICE {
  get PORT() {
    return Number(process.env.PORT) || 4000;
  }

  get URL() {
    return process.env.URL || `http://localhost:${this.PORT}`;
  }

  get NODE_ENV() {
    return process.env.NODE_ENV || 'dev';
  }

  get ORIGIN() {
    if (!process.env.ORIGIN) {
      throw new InternalServerErrorException(MessageService.Origin_not_found);
    }

    return process.env.ORIGIN;
  }

  get KEY() {
    if (!process.env.KEY) {
      throw new InternalServerErrorException(MessageService.Key_not_found);
    }

    return process.env.KEY;
  }

  get FTP_HOST() {
    if (!process.env.FTP_HOST) {
      throw new InternalServerErrorException(MessageService.FTP_HOST_found);
    }

    return process.env.FTP_HOST;
  }

  get FTP_USER() {
    if (!process.env.FTP_USER) {
      throw new InternalServerErrorException(MessageService.FTP_USER_found);
    }

    return process.env.FTP_USER;
  }

  get FTP_PASS() {
    if (!process.env.FTP_PASS) {
      throw new InternalServerErrorException(MessageService.FTP_PASS_found);
    }

    return process.env.FTP_PASS;
  }

  get DATABASE_URL() {
    if (!process.env.DATABASE_URL) {
      throw new InternalServerErrorException(MessageService.Database_not_found);
    }

    return process.env.DATABASE_URL;
  }

  get SOFMAN_SMART_URL() {
    if (!process.env.SOFMAN_SMART_URL) {
      throw new InternalServerErrorException(MessageService.Database_not_found);
    }

    return process.env.SOFMAN_SMART_URL;
  }

  get FILE_PATH() {
    if (!process.env.FILE_PATH) {
      throw new InternalServerErrorException(MessageService.Filepath_not_found);
    }

    return process.env.FILE_PATH;
  }

  get FILE_IMPORT() {
    if (!process.env.FILE_IMPORT) {
      return '';
    }

    return process.env.FILE_IMPORT;
  }

  get URL_IMAGE() {
    if (!process.env.URL_IMAGE) {
      throw new InternalServerErrorException(
        MessageService.URL_IMAGE_not_found,
      );
    }

    return process.env.URL_IMAGE;
  }
}
