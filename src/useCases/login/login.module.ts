import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
// import { LoginRepository } from 'src/repositories/login-repository';
// import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import { JwtService } from '@nestjs/jwt';
import { ENVService } from 'src/service/env.service';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
// import ManagerCompanyRepository from 'src/repositories/manager-company-repository';
// import ManagerCompanyRepositoryPrisma from 'src/repositories/prisma/manager-company-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';
// import { TokenProvider } from 'src/models/TokenProvider';
// import { TenantPrismaService } from 'src/service/tenant.prisma.service';
// import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [TenantRepositoriesModule],
  controllers: [LoginController],
  providers: [
    // {
    //   provide: LoginRepository,
    //   useClass: LoginRepositoryPrisma,
    // },
    // {
    //   provide: TokenProvider.login,
    //   useFactory: async (tenantPrismaService: TenantPrismaService) => {
    //     const tenantId = 1; // Ex: via header, token, etc.
    //     const client = (await tenantPrismaService.getPrismaClient(
    //       tenantId,
    //     )) as PrismaService;
    //     return new LoginRepositoryPrisma(client);
    //   },
    //   inject: [TenantPrismaService],
    // },
    JwtService,
    ENVService,
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
    // {
    //   provide: ManagerCompanyRepository,
    //   useClass: ManagerCompanyRepositoryPrisma,
    // },
  ],
})
export class loginModule {}
