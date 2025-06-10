import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// //import { LoginRepository } from 'src/repositories/login-repository';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
//import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { ModuleService } from 'src/service/module.service';
import { ProfileController } from './profile.controller';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import { MenuRepository } from 'src/repositories/menu-repository';
// import { MenuRepositoryPrisma } from 'src/repositories/prisma/menu-repository-prisma';
// import ConfigTableRepository from 'src/repositories/config-table-repository';
// import ConfigTableRepositoryPrisma from 'src/repositories/prisma/config-table-repository-prisma';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';

@Module({
  imports: [TenantRepositoriesModule],
  controllers: [ProfileController],
  providers: [
    ENVService,
    JwtService,
    // {
    //   provide: LoginRepository,
    //   useClass: LoginRepositoryPrisma,
    // },
    // {
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    ModuleService,
    // {
    //   provide: UserRepository,
    //   useClass: UserRepositoryPrisma,
    // },
    // {
    //   provide: BranchesByUserRepository,
    //   useClass: BranchesByUserRepositoryPrisma,
    // },
    // {
    //   provide: PermissionRepository,
    //   useClass: PermissionRepositoryPrisma,
    // },
    // {
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    // {
    //   provide: MenuRepository,
    //   useClass: MenuRepositoryPrisma,
    // },
    // {
    //   provide: ConfigTableRepository,
    //   useClass: ConfigTableRepositoryPrisma,
    //},
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
  ],
})
export class profileModule {}
