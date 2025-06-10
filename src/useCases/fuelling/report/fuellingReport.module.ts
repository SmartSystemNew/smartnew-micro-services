import { Module } from '@nestjs/common';
import { ControlFuellingModule } from './control-fuelling/controlFuelling.module';
import { FamilyConsumptionModule } from './family-consumption/family-consumption.module';

@Module({
  imports: [ControlFuellingModule, FamilyConsumptionModule],
  controllers: [],
  providers: [],
})
export class FuellingReportModule {}
