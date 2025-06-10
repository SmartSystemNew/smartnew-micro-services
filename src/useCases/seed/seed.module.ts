import { Module } from '@nestjs/common';
import SeedController from './seed.controller';
import SeedRepository from 'src/repositories/seed-repository';
import SeedRepositoryPrisma from 'src/repositories/prisma/seed-repository-prisma';
import { ENVService } from 'src/service/env.service';

@Module({
  imports: [],
  controllers: [SeedController],
  providers: [
    ENVService,
    {
      provide: SeedRepository,
      useClass: SeedRepositoryPrisma,
    },
  ],
})
export class SeedModule {}
