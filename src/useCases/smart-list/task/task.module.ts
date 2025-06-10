import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
import { CheckListStatusActionRepository } from 'src/repositories/checklist-status-action-repository';
import { CheckListTaskRepository } from 'src/repositories/checklist-task-repository';
import { LoginRepository } from 'src/repositories/login-repository';
import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
import { CheckListPeriodRepositoryPrisma } from 'src/repositories/prisma/checklist-period-repository-prisma';
import { CheckListStatusActionRepositoryPrisma } from 'src/repositories/prisma/checklist-status-action-repository-prisma';
import { CheckListTaskRepositoryPrisma } from 'src/repositories/prisma/checklist-task-repository-prisma';
import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { TaskController } from './task.controller';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

@Module({
  imports: [],
  controllers: [TaskController],
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
      provide: CheckListTaskRepository,
      useClass: CheckListTaskRepositoryPrisma,
    },
    {
      provide: BranchesByUserRepository,
      useClass: BranchesByUserRepositoryPrisma,
    },
    {
      provide: PermissionRepository,
      useClass: PermissionRepositoryPrisma,
    },
    {
      provide: CheckListStatusActionRepository,
      useClass: CheckListStatusActionRepositoryPrisma,
    },
    {
      provide: CheckListPeriodRepository,
      useClass: CheckListPeriodRepositoryPrisma,
    },
    {
      provide: ModuleRepository,
      useClass: ModuleRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class TaskModule {}
