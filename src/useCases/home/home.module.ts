import { Module } from '@nestjs/common';
import { HomeResolver } from './home.resolver';

@Module({
  providers: [HomeResolver],
})
export class homeModule {}
