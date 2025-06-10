// import { Module } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
// import { LoginRepository } from 'src/repositories/login-repository';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import { CheckListPeriodRepositoryPrisma } from 'src/repositories/prisma/checklist-period-repository-prisma';
// import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
// import { ProductionChecklistActionGroupRepositoryPrisma } from 'src/repositories/prisma/production-checklist-action-group-repository-prisma';
// import { ProductionChecklistActionRepositoryPrisma } from 'src/repositories/prisma/production-checklist-action-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import { ProductionChecklistActionGroupRepository } from 'src/repositories/production-checklist-action-group-repository';
// import { ProductionChecklistActionRepository } from 'src/repositories/production-checklist-action-repository';
// import { UserRepository } from 'src/repositories/user-repository';
// import { ENVService } from 'src/service/env.service';
// import { FileService } from 'src/service/file.service';
// import { ActionController } from './action.controller';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

// @Module({
//   imports: [],
//   controllers: [ActionController],
//   providers: [
//     JwtService,
//     ENVService,
//     FileService,
//     {
//       provide: BranchesByUserRepository,
//       useClass: BranchesByUserRepositoryPrisma,
//     },
//     {
//       provide: PermissionRepository,
//       useClass: PermissionRepositoryPrisma,
//     },
//     {
//       provide: ModuleRepository,
//       useClass: ModuleRepositoryPrisma,
//     },
//     {
//       provide: LoginRepository,
//       useClass: LoginRepositoryPrisma,
//     },
//     {
//       provide: UserRepository,
//       useClass: UserRepositoryPrisma,
//     },
//     {
//       provide: CheckListPeriodRepository,
//       useClass: CheckListPeriodRepositoryPrisma,
//     },
//     {
//       provide: ProductionChecklistActionRepository,
//       useClass: ProductionChecklistActionRepositoryPrisma,
//     },
//     {
//       provide: ProductionChecklistActionGroupRepository,
//       useClass: ProductionChecklistActionGroupRepositoryPrisma,
//     },
//     {
//       provide: CompanyRepository,
//       useClass: CompanyRepositoryPrisma,
//     },
//   ],
// })
// export class ActionModule {}
