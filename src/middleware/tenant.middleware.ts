// tenant.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'node:fs';
import { ENVService } from 'src/service/env.service';
import { ContextService } from 'src/service/request-context.service';
//import { RequestContextService } from 'src/service/request-context.service';
import { v4 as uuidv4 } from 'uuid';
import console from 'node:console';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    //@Inject(RequestContextService)
    private contextService: ContextService,
    private envService: ENVService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req) || req.cookies.jwt;

    const payload =
      req.baseUrl !== '/login/with-login' && req.baseUrl !== '/login'
        ? token
          ? token !== 'script-case' && token !== 'pdf'
            ? await this.jwtService.verifyAsync(token, {
                secret: this.envService.KEY,
              })
            : {
                sub: req.query.login || req.body.login,
                clientId: req.query.clientId || req.body.clientId,
              }
          : null
        : null;

    const pathName = req.baseUrl
      .split('/')
      [req.baseUrl.split('/').length - 1].replaceAll('-', '_')
      .split('?')[0];

    const contextDir = path.join(__dirname, '..', '..', 'public', 'context');

    const contextFilePath = path.join(contextDir, `${pathName}_context.json`);

    const requestId = uuidv4();

    if (
      req.baseUrl.includes('/login') ||
      req.baseUrl.includes('/script-case')
    ) {
      const origin = req.get('origin') || '';
      //'https://homolog.smartnewservices.com.br';
      //req.get('origin');
      const tenantId = req.baseUrl.includes('/login') ? 1 : undefined;
      const url = req.baseUrl;

      req['tenantId'] = tenantId;
      req['origin'] = origin || '';

      // Ler o conteúdo existente do arquivo (se existir)
      let existingData: { [key: string]: any } = {};
      if (fs.existsSync(contextFilePath)) {
        existingData = JSON.parse(fs.readFileSync(contextFilePath, 'utf-8'));
      }

      // Adicionar o novo objeto ao conteúdo existente
      existingData[requestId] = {
        requestId,
        tenantId: payload
          ? payload?.tenantId
            ? payload.tenantId
            : tenantId
          : tenantId,
        origin,
        url,
        login: payload
          ? payload.sub
          : Object.keys(req.body).length > 0
          ? req.body?.login
          : req.query?.login,
        timestamp: new Date().toISOString(),
      };

      console.log(requestId);

      console.log('existingData => ', existingData);

      // Criar o diretório public/context se não existir
      if (!fs.existsSync(contextDir)) {
        fs.mkdirSync(contextDir, { recursive: true });
        //console.log(`Diretório ${contextDir} criado com sucesso`);
      }

      fs.writeFileSync(contextFilePath, JSON.stringify(existingData, null, 2), {
        flag: 'w',
      });

      // Criar o diretório public/context se não existir
      if (!fs.existsSync(contextDir)) {
        fs.mkdirSync(contextDir, { recursive: true });
        //console.log(`Diretório ${contextDir} criado com sucesso`);
      }

      fs.writeFileSync(contextFilePath, JSON.stringify(existingData, null, 2), {
        flag: 'w',
      });

      req['requestId'] = requestId;

      res.on('finish', () => {
        if (fs.existsSync(contextFilePath)) {
          const currentData = JSON.parse(
            fs.readFileSync(contextFilePath, 'utf-8'),
          );
          delete currentData[requestId]; // Remove o objeto com o requestId

          if (Object.keys(currentData).length === 0) {
            // Se não houver mais objetos, remove o arquivo
            fs.unlink(contextFilePath, (err) => {
              if (err) console.error('Erro ao limpar arquivo:', err);
            });
          } else {
            // Caso contrário, reescreve o arquivo com os objetos restantes
            fs.writeFileSync(
              contextFilePath,
              JSON.stringify(currentData, null, 2),
              {
                flag: 'w',
              },
            );
          }
        }
      });

      next();
      return;
    }
    // Exemplo simples. Decodifique seu token e pegue o tenantId
    // implemente a lógica real

    //req.tenantId = payload.tenantId;
    // this.contextService.setTenantId(payload.tenantId || 1);
    // this.contextService.setOrigin(req.headers.origin);
    // this.contextService.setUrl(req.url);
    req['tenantId'] = payload?.tenantId || 1;
    req['origin'] = req.get('origin') || '';

    // Ler o conteúdo existente do arquivo (se existir)
    let existingData: { [key: string]: any } = {};
    if (fs.existsSync(contextFilePath)) {
      existingData = JSON.parse(fs.readFileSync(contextFilePath, 'utf-8'));
    }

    // Adicionar o novo objeto ao conteúdo existente

    existingData[requestId] = {
      requestId,
      tenantId: payload?.tenantId || 1,
      origin: req.headers.origin || '',
      url: req.baseUrl || '',
      login: payload
        ? payload.sub
        : Object.keys(req.body).length > 0
        ? req.body?.login
        : req.query?.login,
      timestamp: new Date().toISOString(),
    };

    // Criar o diretório public/context se não existir
    if (!fs.existsSync(contextDir)) {
      fs.mkdirSync(contextDir, { recursive: true });
      //console.log(`Diretório ${contextDir} criado com sucesso`);
    }

    fs.writeFileSync(contextFilePath, JSON.stringify(existingData, null, 2), {
      flag: 'w',
    });

    req['requestId'] = requestId;

    res.on('finish', () => {
      if (fs.existsSync(contextFilePath)) {
        const currentData = JSON.parse(
          fs.readFileSync(contextFilePath, 'utf-8'),
        );
        delete currentData[requestId]; // Remove o objeto com o requestId

        if (Object.keys(currentData).length === 0) {
          // Se não houver mais objetos, remove o arquivo
          fs.unlink(contextFilePath, (err) => {
            if (err) console.error('Erro ao limpar arquivo:', err);
          });
        } else {
          // Caso contrário, reescreve o arquivo com os objetos restantes
          fs.writeFileSync(
            contextFilePath,
            JSON.stringify(currentData, null, 2),
            {
              flag: 'w',
            },
          );
        }
      }
    });

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (request.url.includes('/maintenance/request-service/list/?token')) {
      const token = request.url.split('=') ?? [];
      token[1] = token[1].replace('&day', '');

      return token[1];
    } else if (
      request.url.includes(
        '/maintenance/service-order/list-order-params/?token',
      )
    ) {
      const token = request.url.split('=') ?? [];
      token[1] = token[1].replace('&dateOpen', '');

      return token[1];
    } else if (request.url.includes('/script-case')) {
      return 'script-case';
    } else if (request?.query?.b) {
      const token = request.query.b.toString() ?? '';

      return token || '';
    } else if (
      request.url.includes('/maintenance/reports') &&
      request.query.format === 'pdf'
    ) {
      return 'pdf';
    } else {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      return type === 'Bearer' ? token : undefined;
    }
  }
}
