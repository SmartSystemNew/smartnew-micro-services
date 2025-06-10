import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import { UserRepository } from 'src/repositories/user-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FTPService } from 'src/service/ftp.service';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';
import { FinancialScriptCaseModule } from './financial/financial-script-case.module';
import { SystemScriptCaseModule } from './system/system-script-case.module';
import { BuyScriptCaseModule } from './buy/buy-script-case.module';
import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
import MaterialServiceOrderRepositoryPrisma from 'src/repositories/prisma/material-service-order-repository-prisma';

@Module({
  imports: [
    FinancialScriptCaseModule,
    SystemScriptCaseModule,
    BuyScriptCaseModule,
    TenantRepositoriesModule,
  ],
  controllers: [],
  providers: [
    JwtService,
    ENVService,
    FTPService,
    DateService,
    // {
    //   provide: BranchesByUserRepository,
    //   useClass: BranchesByUserRepositoryPrisma,
    // },
    // // {
    // //   provide: LoginRepository,
    // //   useClass: LoginRepositoryPrisma,
    // // },
    // {
    //   provide: UserRepository,
    //   useClass: UserRepositoryPrisma,
    // },
    // {
    //   provide: PermissionRepository,
    //   useClass: PermissionRepositoryPrisma,
    // },
  ],
})
export class ScriptCaseModule {}
