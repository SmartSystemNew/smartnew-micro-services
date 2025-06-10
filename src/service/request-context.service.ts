import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AsyncLocalStorage } from 'async_hooks';
import path from 'path';
import fs from 'node:fs';

type RequestContext = {
  tenantId?: number;
  origin?: string;
  url?: string;
};

@Injectable()
export class ContextService {
  constructor(@Inject(REQUEST) private request: any) {}
  private readonly asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  getContext() {
    const requestId = this.request['requestId'];

    const nameUrl =
      this.request.originalUrl.split('?')[0].split('/')[
        this.request.originalUrl.split('?')[0].split('/').length - 1
      ].length > 0
        ? this.request.originalUrl.split('?')[0].split('/')[
            this.request.originalUrl.split('?')[0].split('/').length - 1
          ]
        : this.request.originalUrl.split('?')[0].split('/')[
            this.request.originalUrl.split('?')[0].split('/').length - 2
          ];
    const pathName = nameUrl.replaceAll('-', '_').split('?')[0];

    const contextDir = path.join(__dirname, '..', '..', 'public', 'context');

    const contextFilePath = path.join(contextDir, `${pathName}_context.json`);

    if (fs.existsSync(contextFilePath)) {
      const contextData = JSON.parse(fs.readFileSync(contextFilePath, 'utf-8'));
      //console.log('Contexto lido do arquivo:', contextData);

      const context = contextData[requestId];

      return (
        context || {
          requestId,
          tenantId: undefined,
          origin: undefined,
          url: undefined,
        }
      );
    }
    console.log(
      'Arquivo de contexto não encontrado para requestId:',
      requestId,
    );
    return { tenantId: undefined, origin: undefined, url: undefined };
  }

  updateContext(requestId: string, context: RequestContext) {
    const pathName = this.request.originalUrl
      .split('/')
      [this.request.originalUrl.split('/').length - 1].replaceAll('-', '_')
      .split('?')[0];

    const contextDir = path.join(__dirname, '..', '..', 'public', 'context');

    const contextFilePath = path.join(contextDir, `${pathName}_context.json`);

    if (fs.existsSync(contextFilePath)) {
      const contextData = JSON.parse(fs.readFileSync(contextFilePath, 'utf-8'));

      contextData[requestId] = context;

      fs.writeFileSync(contextFilePath, JSON.stringify(contextData, null, 2), {
        flag: 'w',
      });

      return context;
    }
    console.log(
      'Arquivo de contexto não encontrado para requestId:',
      requestId,
    );
    return { tenantId: undefined, origin: undefined, url: undefined };
  }

  // Inicializa o contexto e executa o callback dentro do escopo do AsyncLocalStorage
  run<T>(callback: () => Promise<T>): Promise<T> {
    console.log('ContextService.run chamado');
    return new Promise((resolve, reject) => {
      this.asyncLocalStorage.run({}, () => {
        const tenantId =
          this.request['tenantId'] ||
          (this.request.url.includes('/login') ? 1 : undefined);
        const origin = this.request.headers?.origin || '';
        const url = this.request.baseUrl || this.request.url || '';

        if (tenantId) this.setTenantId(tenantId);
        this.setOrigin(origin);
        this.setUrl(url);

        Promise.resolve(callback()).then(resolve).catch(reject);
      });
    });
  }

  setParams() {
    this.setTenantId(this.request['tenantId']);
    this.setOrigin(this.request['origin']);
  }

  setTenantId(tenantId: number) {
    const store = this.asyncLocalStorage.getStore();
    if (store) store.tenantId = tenantId;
  }

  getTenantId(): number | undefined {
    return this.asyncLocalStorage.getStore()?.tenantId;
  }

  setOrigin(origin: string) {
    const store = this.asyncLocalStorage.getStore();
    if (store) store.origin = origin;
  }

  getOrigin(): string | undefined {
    if (!this.asyncLocalStorage.getStore()) {
      this.setParams();
      console.log(this.asyncLocalStorage.getStore());
    }
    return this.asyncLocalStorage.getStore()?.origin;
  }

  setUrl(url: string) {
    const store = this.asyncLocalStorage.getStore();
    if (store) store.url = url;
  }

  getUrl(): string | undefined {
    return this.asyncLocalStorage.getStore()?.url;
  }
}
