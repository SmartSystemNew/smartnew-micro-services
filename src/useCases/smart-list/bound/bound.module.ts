import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { CheckListControlRepository } from 'src/repositories/checklist-control-repository';
import { CheckListItemRepository } from 'src/repositories/checklist-item-repository';
import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
import { CheckListRepository } from 'src/repositories/checklist-repository';
import { FamilyRepository } from 'src/repositories/family-repository';
import { LoginRepository } from 'src/repositories/login-repository';
import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
import { CheckListControlRepositoryPrisma } from 'src/repositories/prisma/checklist-control-repository-prisma';
import { CheckListItemRepositoryPrisma } from 'src/repositories/prisma/checklist-item-repository-prisma';
import { CheckListPeriodRepositoryPrisma } from 'src/repositories/prisma/checklist-period-repository-prisma';
import { CheckListRepositoryPrisma } from 'src/repositories/prisma/checklist-repository-prisma';
import { FamilyRepositoryPrisma } from 'src/repositories/prisma/family-repository-prisma';
import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { BoundController } from './bound.controller';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
import LocationRepository from 'src/repositories/location-repository';
import LocationRepositoryPrisma from 'src/repositories/prisma/location-repository-prisma';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import ChecklistService from 'src/service/checklist.service';
import { DateService } from 'src/service/data.service';
import EquipmentRepository from 'src/repositories/equipment-repository';
import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

@Module({
  imports: [],
  controllers: [BoundController],
  providers: [
    JwtService,
    ENVService,
    ChecklistService,
    DateService,
    {
      provide: BranchesByUserRepository,
      useClass: BranchesByUserRepositoryPrisma,
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
      provide: LoginRepository,
      useClass: LoginRepositoryPrisma,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    {
      provide: CheckListRepository,
      useClass: CheckListRepositoryPrisma,
    },
    {
      provide: FamilyRepository,
      useClass: FamilyRepositoryPrisma,
    },
    {
      provide: CheckListItemRepository,
      useClass: CheckListItemRepositoryPrisma,
    },
    {
      provide: CheckListControlRepository,
      useClass: CheckListControlRepositoryPrisma,
    },
    {
      provide: BranchesByUserRepository,
      useClass: BranchesByUserRepositoryPrisma,
    },
    {
      provide: CheckListPeriodRepository,
      useClass: CheckListPeriodRepositoryPrisma,
    },
    {
      provide: LocationRepository,
      useClass: LocationRepositoryPrisma,
    },
    {
      provide: EquipmentRepository,
      useClass: EquipmentRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class BoundModule {}
