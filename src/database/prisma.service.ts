import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ENVService } from 'src/service/env.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private maxRetries = 3;
  private retryDelay = 5000; // Tempo de espera entre tentativas de reconexão

  async onModuleInit() {
    await this.$connect().catch((error) => {
      console.error(error);
      setTimeout(() => this.onModuleInit(), 5000);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Desconecta do banco de dados quando o módulo for destruído
  }

  constructor(private env: ENVService) {
    super({
      log:
        //env.NODE_ENV === 'dev' || env.NODE_ENV === 'docker'
        //?
        ['query', 'warn', 'info', 'error'],
      //  : ['error'],
      ///log: ['query'],
    });
  }
}
