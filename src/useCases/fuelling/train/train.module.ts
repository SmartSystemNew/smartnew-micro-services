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
import FuellingTrainRepository from 'src/repositories/fuelling-train-repository';
import FuellingTrainRepositoryPrisma from 'src/repositories/prisma/fuelling-train-repository-prisma';
import { BranchRepository } from 'src/repositories/branch-repository';
import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
import FuellingTrainCompartmentRepository from 'src/repositories/fuelling-train-compartment-repository';
import FuellingTrainCompartmentRepositoryPrisma from 'src/repositories/prisma/fuelling-train-compartment-repository-prisma';
import { FuelRepository } from 'src/repositories/fuel-repository';
import FuelRepositoryPrisma from 'src/repositories/prisma/fuel-repository-prisma';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';

@Module({
  imports: [],
  controllers: [],
  providers: [
    JwtService,
    ENVService,
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
      provide: PermissionRepository,
      useClass: PermissionRepositoryPrisma,
    },
    {
      provide: FuellingTrainRepository,
      useClass: FuellingTrainRepositoryPrisma,
    },
    {
      provide: BranchRepository,
      useClass: BranchRepositoryPrisma,
    },
    {
      provide: FuellingTrainCompartmentRepository,
      useClass: FuellingTrainCompartmentRepositoryPrisma,
    },
    {
      provide: FuelRepository,
      useClass: FuelRepositoryPrisma,
    },
  ],
})
export class TrainModule {}
