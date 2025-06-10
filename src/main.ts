import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { ENVService } from './service/env.service';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodExceptionFilter } from './service/zodException.service';
import { join } from 'path';
import * as express from 'express';
//import { ContextInterceptor } from './interceptor/context.interceptor';
//import { MyLogger } from './service/logger.service';

async function bootstrap() {
  const envService = new ENVService();

  const app = await NestFactory.create(AppModule, {
    //logger: new MyLogger(),
    cors: {
      origin: envService.ORIGIN,
      //allowedHeaders: 'true',
    },
  });
  //Todo caminho uploads para o storage
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalFilters(new ZodExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Documentação SmartNew')
    .setDescription('Documentação dos endpoint públicos')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Login')
    .addTag('Finance')
    .addTag('Maintenance')
    .addTag('Maintenance Service Order')
    .addTag('Script Case')
    .build();

  const documentStopLight = SwaggerModule.createDocument(app, config);

  app.use('/api-json', (req: express.Request, res: express.Response) => {
    res.json(documentStopLight);
  });

  // Configura a pasta public como estática usando express.static
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  app.use('/docs', (req: express.Request, res: express.Response) => {
    res.sendFile(join(__dirname, '..', 'public', 'rapi-doc.html'));
  });

  // const documentSwagger = SwaggerModule.createDocument(app, config, {
  //   // include: [maintenanceModule],
  // });

  SwaggerModule.setup('api/docs', app, documentStopLight, {
    swaggerOptions: {
      persistAuthorization: true,
      // Personalizar o layout padrão
      docExpansion: 'none', // Opções: 'none', 'list', 'full'
      filter: '', // Permite buscar tags
      tagsSorter: 'none', // Ordena as tags alfabeticamente
      operationsSorter: 'alpha', // Ordena operações (endpoints) alfabeticamente
      defaultFilter: '',
    },
    customCss: `
      body { background-color: #f7f7f7; }
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { background-color: #f7f7f7 }
      .swagger-ui .scheme-container {background: #f7f7f7}
  }
    `, // Adicione CSS personalizado aqui
    customSiteTitle: 'API SmartNew',
    customfavIcon:
      'https://sistemas.smartnewsystem.com.br/_lib/libraries/grp/metronic/favicon.ico',
  });

  await app.listen(envService.PORT);
}
bootstrap();
