import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CostCenterRepository } from 'src/repositories/cost-center-repository';
import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';

@ApiTags('Financial - Cost Center')
@Controller('financial/cost-center')
export class CostCenterController {
  constructor(
    private descriptionCostCenterRepository: DescriptionCostCenterRepository,
    private costCenterRepository: CostCenterRepository,
  ) {}

  @Get('/')
  async infoTable() {}
}
