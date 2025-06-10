import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { FTPService } from 'src/service/ftp.service';
import { DateService } from 'src/service/data.service';
// import { BranchRepository } from 'src/repositories/branch-repository';
// import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
//import { LoginRepository } from 'src/repositories/login-repository';
//import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
// import { UserRepository } from 'src/repositories/user-repository';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import EmployeeRepositoryPrisma from 'src/repositories/prisma/employees-repository-prisma';
// import { EmployeeRepository } from 'src/repositories/employee-repository';
import EmployeeController from './employee.controller';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';

@Module({
  imports: [TenantRepositoriesModule],
  controllers: [EmployeeController],
  providers: [
    JwtService,
    ENVService,
    FileService,
    FTPService,
    DateService,
    // {
    //   provide: BranchRepository,
    //   useClass: BranchRepositoryPrisma,
    // },
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
    // {
    //   provide: EmployeeRepository,
    //   useClass: EmployeeRepositoryPrisma,
    // },
    // {
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
  ],
})
export class employeeModule {}
