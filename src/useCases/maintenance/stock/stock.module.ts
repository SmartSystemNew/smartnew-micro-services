import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { LoginRepository } from 'src/repositories/login-repository';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { FTPService } from 'src/service/ftp.service';
import { DateService } from 'src/service/data.service';
import { FileService } from 'src/service/file.service';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import OutController from './out/out.controller';
import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
import MaterialEstoqueRepositoryPrisma from 'src/repositories/prisma/material-estoque-repository-prisma';
import StockInventoryRepositoryPrisma from 'src/repositories/prisma/stock-inventory-repository-prisma';
import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import MaterialCodeRepositoryPrisma from 'src/repositories/prisma/material-code-repository-prisma';
import MaterialRepository from 'src/repositories/material-repository';
import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
import MaintenanceControlStockRepository from 'src/repositories/maintenance-control-stock-repository';
import MaintenanceControlStockRepositoryPrisma from 'src/repositories/prisma/maintenance-control-stock-repository-prisma';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

@Module({
  imports: [],
  controllers: [OutController],
  providers: [
    JwtService,
    ENVService,
    FileService,
    FTPService,
    DateService,
    {
      provide: BranchesByUserRepository,
      useClass: BranchesByUserRepositoryPrisma,
    },
    {
      provide: LoginRepository,
      useClass: LoginRepositoryPrisma,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    {
      provide: PermissionRepository,
      useClass: PermissionRepositoryPrisma,
    },
    {
      provide: ModuleRepository,
      useClass: ModuleRepositoryPrisma,
    },
    {
      provide: StockInventoryRepository,
      useClass: StockInventoryRepositoryPrisma,
    },
    {
      provide: MaterialEstoqueRepository,
      useClass: MaterialEstoqueRepositoryPrisma,
    },
    {
      provide: MaterialCodeRepository,
      useClass: MaterialCodeRepositoryPrisma,
    },
    {
      provide: MaterialRepository,
      useClass: MaterialRepositoryPrisma,
    },
    {
      provide: MaintenanceControlStockRepository,
      useClass: MaintenanceControlStockRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class StockModule {}
