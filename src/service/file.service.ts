import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ENVService } from './env.service';

@Injectable()
export class FileService {
  constructor(private env: ENVService) {}

  list(path: string): string[] {
    const directoryExists = fs.existsSync(path);
    if (directoryExists) {
      const files = fs.readdirSync(path);
      return files;
    } else {
      return [];
    }
  }

  find(path: string): Buffer | null {
    const fileExists = fs.existsSync(path);

    if (fileExists) {
      return fs.readFileSync(path);
    } else null;
  }

  write(path: string, fileName: string, file: Buffer): void {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    fs.writeFileSync(`${path}/${fileName}`, file);
  }

  move(fromPath: string, toPath: string) {
    fs.renameSync(fromPath, toPath);
  }

  delete(path: string) {
    if (!fs.existsSync(path)) {
      return;
    }
    fs.unlinkSync(path);
  }
}
