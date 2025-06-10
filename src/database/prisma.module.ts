import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service'; // Importe o PrismaService
import { ENVService } from 'src/service/env.service';

@Global() // Torna o PrismaModule acessível em toda a aplicação sem a necessidade de importá-lo em cada módulo
@Module({
  providers: [
    PrismaService, // Declara o PrismaService como provider
    ENVService, // Declara o ENVService como provider
  ],
  exports: [PrismaService], // Permite que outros módulos acessem o PrismaService
})
export class PrismaModule {}
