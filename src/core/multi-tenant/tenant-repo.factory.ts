import { Abstract, Provider } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { RequestContextService } from 'src/service/request-context.service';
// import { TenantPrismaService } from 'src/service/tenant.prisma.service';
import { PrismaService } from 'src/database/prisma.service';

// export function createTenantRepositoryProvider<T>(
//   token: any, // pode ser classe ou string
//   factory: (client: PrismaClient) => T,
// ): Provider {
//   return {
//     provide: token,
//     useFactory: async (
//       tenantPrismaService: TenantPrismaService,
//       requestContextService: RequestContextService,
//     ): Promise<T> => {
//       //console.log(request);
//       const tenantId = requestContextService.getTenantId();
//       const origin = requestContextService.getOrigin();
//       //console.log('tenantId => ', tenantId);
//       const client = await tenantPrismaService.getPrismaClient(
//         tenantId,
//         origin,
//       );
//       return factory(client);
//     },
//     inject: [TenantPrismaService, RequestContextService],
//   };
// }

export function createTenantRepositoryProvider<T>(
  token: Abstract<T>,
  factory: (client: PrismaService) => T,
): Provider {
  return {
    provide: token,
    useFactory: (client: PrismaService) => factory(client),
    inject: ['PRISMA_CLIENT'],
  };
}
