import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { LoginRepository } from 'src/repositories/login-repository';
import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { DiverseController } from './diverse.controller';
import ProductionCategoryDiverseRepository from 'src/repositories/production-category-diverse-repository';
import { ProductionCategoryDiverseRepositoryPrisma } from 'src/repositories/prisma/production-category-diverse-repository-prisma';
import { BranchRepository } from 'src/repositories/branch-repository';
import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
import { ProductionCategoryItemsRepository } from 'src/repositories/production-category-items-repository';
import { ProductionCategoryItemsRepositoryPrisma } from 'src/repositories/prisma/production-category-items-repository-prisma';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

@Module({
  imports: [],
  controllers: [DiverseController],
  providers: [
    JwtService,
    ENVService,
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
      provide: ProductionCategoryDiverseRepository,
      useClass: ProductionCategoryDiverseRepositoryPrisma,
    },
    {
      provide: BranchesByUserRepository,
      useClass: BranchesByUserRepositoryPrisma,
    },
    {
      provide: BranchRepository,
      useClass: BranchRepositoryPrisma,
    },
    {
      provide: ProductionCategoryItemsRepository,
      useClass: ProductionCategoryItemsRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class DiverseModule {}
