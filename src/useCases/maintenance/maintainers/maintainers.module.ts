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
import MaintainersController from 'src/useCases/maintenance/maintenance.controller';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
import ColaboratorRepository from 'src/repositories/colaborator-repository';
import ColaboratorRepositoryPrisma from 'src/repositories/prisma/colaborator-repository-prisma';
import ServiceOrderMaintainerRepositoryPrisma from 'src/repositories/prisma/service-order-maintainer-repository-prisma';
import ServiceOrderMaintainerRepository from 'src/repositories/service-order-maintainer-repository';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

@Module({
  imports: [],
  controllers: [MaintainersController],
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
      provide: ServiceOrderRepository,
      useClass: ServiceOrderRepositoryPrisma,
    },
    {
      provide: ColaboratorRepository,
      useClass: ColaboratorRepositoryPrisma,
    },
    {
      provide: ServiceOrderMaintainerRepository,
      useClass: ServiceOrderMaintainerRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class MaintenenceModule {}
