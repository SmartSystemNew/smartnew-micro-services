import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ENVService } from './env.service';
import { Client } from 'basic-ftp';

@Injectable()
export class FTPService {
  constructor(private env: ENVService) {}

  async connect(): Promise<Client> {
    const client = new Client();

    await client.access({
      host: this.env.FTP_HOST,
      user: this.env.FTP_USER,
      password: this.env.FTP_PASS,
    });
    return client;
  }

  async close(client: Client): Promise<void> {
    return client.close();
  }

  async changeDir(client: Client, path: string): Promise<void> {
    await client.ensureDir(path);
  }

  async insertFile(
    client: Client,
    path: string,
    file:
      | Express.Multer.File
      | {
          originalname: string;
          buffer: Buffer;
        },
  ): Promise<void> {
    const tempName = `${file.originalname.trim()}`;
    const remotePath = `${path}/${tempName}`;

    try {
      await fs.promises.writeFile(tempName, file.buffer, 'binary');
      await client.uploadFrom(tempName, remotePath);

      await fs.promises.unlink(tempName);
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      throw error; // Re-lança o erro para ser capturado no bloco try...catch principal
    }
  }

  async deleteFile(client: Client, path: string): Promise<void> {
    await client.remove(path);
  }
}
