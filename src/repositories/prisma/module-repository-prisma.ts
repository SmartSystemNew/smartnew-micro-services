import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IListAll } from 'src/models/IModule';
import { ModuleRepository } from '../module-repository';

@Injectable()
export class ModuleRepositoryPrisma implements ModuleRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_modulo_nome;

  async listAll(): Promise<IListAll[]> {
    const modules = await this.table.findMany();

    return modules;
  }
}
