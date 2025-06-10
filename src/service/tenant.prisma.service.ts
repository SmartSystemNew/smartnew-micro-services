// src/prisma/tenant-prisma.service.ts
import {
  Injectable,
  NotFoundException,
  // Scope
} from '@nestjs/common';
//import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { ENVService } from 'src/service/env.service';
//import { z } from 'zod';
import { ContextService } from './request-context.service';
import BankBoundService from './bank.bound.service';
//import { Request } from 'express';

//@Injectable({ scope: Scope.REQUEST }) // ou simplesmente remova o escopo
@Injectable()
export class TenantPrismaService {
  private clients = new Map<number, PrismaClient>();
  private maxRetries = 3; // Número máximo de tentativas
  private retryDelay = 5000; // Atraso de 5 segundos entre tentativas (ajuste conforme necessário)
  //private env = new ENVService();

  constructor(
    private envService: ENVService,
    private bankBoundService: BankBoundService,
    private contextService: ContextService,
  ) {}

  async getPrismaClient(
    tenantId: number,
    data: {
      requestId: string;
      origin: string;
      url: string;
      login: string;
    } | null,
  ): Promise<PrismaClient> {
    // console.log(
    //   `Checking PrismaClient for tenantId: ${tenantId}, origin: ${origin}`,
    // );

    if (this.clients.has(tenantId)) {
      return this.clients.get(tenantId)!;
    }

    //console.log(`Creating new PrismaClient for tenantId: ${tenantId}`);

    let attempt = 0;

    while (attempt < this.maxRetries) {
      try {
        if (data.url.includes('/login') || data.url.includes('/script-case')) {
          const allUser = await this.getTenantConnectionByLogin(data.login);

          if (allUser.length > 1) {
            if (!tenantId) {
              tenantId = data?.origin?.includes('sofman.smartnewservices')
                ? 2
                : 1;
              //allUser[0].id_banco;
              this.contextService.updateContext(data.requestId, {
                tenantId,
                origin: data.origin,
                url: data.url,
              });
            } else {
              const find = allUser.find((value) => value.id_banco === tenantId);

              if (!find) {
                throw new Error(
                  `Bank Not Found in /login and tenantId : ${tenantId}`,
                );
              }

              //tenantId = find.id_banco;
              tenantId = data?.origin?.includes('sofman.smartnewservices')
                ? 2
                : 1;

              this.contextService.updateContext(data.requestId, {
                tenantId,
                origin: data?.origin,
                url: data.url,
              });
            }
          } else {
            tenantId = allUser[0].id_banco;
            this.contextService.updateContext(data.requestId, {
              tenantId,
              origin: data.origin,
              url: data.url,
            });
          }
        } else {
        }
        // console.log('tenantId => ', tenantId);
        // console.log('data => ', data);

        const connection = data.origin
          ? data.origin.includes('sofman.smartnewservices')
            ? { url: this.bankBoundService.getSofman() }
            : data.origin.includes('homolog.smartnewservices') ||
              data.origin.includes('smartnewservices') ||
              data.origin.includes('localhost')
            ? { url: this.bankBoundService.getSmart() }
            : tenantId
            ? await this.getTenantConnection(tenantId)
            : { url: '' }
          : tenantId
          ? await this.getTenantConnection(tenantId)
          : { url: '' };

        if (connection.url === '') {
          throw new Error('Bank not found');
        }

        const client = new PrismaClient({
          datasources: { db: { url: connection.url } },
          log:
            //['query', 'error'],
            this.envService.NODE_ENV === 'dev' ||
            this.envService.NODE_ENV === 'docker'
              ? ['query']
              : ['error'],
        });

        await client.$connect();

        this.clients.set(tenantId, client);

        return client;
        //}
        //}
      } catch (error) {
        attempt++;
        if (attempt === this.maxRetries) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      }
    }

    throw new Error('Unable to connect to Prisma client after max retries');
  }

  private async getTenantConnection(tenantId: number) {
    const defaultPrisma = new PrismaClient({
      log:
        //['query', 'error'],
        this.envService.NODE_ENV === 'dev' ||
        this.envService.NODE_ENV === 'docker'
          ? ['query']
          : ['error'],
    });

    const conn = await defaultPrisma.smartnewsystem_conexao_banco.findFirst({
      where: { id: tenantId },
    });
    await defaultPrisma.$disconnect();

    if (!conn) throw new NotFoundException('Tenant não encontrado');
    return conn;
  }

  private async getTenantConnectionByLogin(login: string) {
    const defaultPrisma = new PrismaClient({
      log:
        //['query', 'error'],
        this.envService.NODE_ENV === 'dev' ||
        this.envService.NODE_ENV === 'docker'
          ? ['query']
          : ['error'],
    });

    const allUser =
      await defaultPrisma.smartnewsystem_usuario_vinculo_banco.findMany({
        where: { login },
      });

    await defaultPrisma.$disconnect();

    if (!allUser) throw new NotFoundException('Usuario não encontrado');
    return allUser;
  }
}
