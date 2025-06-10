import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { LoginRepository } from 'src/repositories/login-repository';
import MaterialRepository from 'src/repositories/material-repository';
import { ModuleRepository } from 'src/repositories/module-repository';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
import TypeMaintenanceRepositoryPrisma from 'src/repositories/prisma/type-maintenance-repository-prisma';
import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
import serviceOrderRepository from 'src/repositories/service-order-repository';
import { UserRepository } from 'src/repositories/user-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { FTPService } from 'src/service/ftp.service';
import ReportsController from './reports.controller';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

@Module({
  imports: [],
  controllers: [ReportsController],
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
      provide: serviceOrderRepository,
      useClass: ServiceOrderRepositoryPrisma,
    },
    {
      provide: MaterialRepository,
      useClass: MaterialRepositoryPrisma,
    },
    {
      provide: TypeMaintenanceRepository,
      useClass: TypeMaintenanceRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export default class reportsModule {}
