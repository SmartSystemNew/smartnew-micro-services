import { Module } from '@nestjs/common';
import ServiceController from './service.controller';
import { ENVService } from 'src/service/env.service';
import { DateService } from 'src/service/data.service';

@Module({
  imports: [],
  controllers: [ServiceController],
  providers: [ENVService, DateService],
})
export class serviceModule {}
