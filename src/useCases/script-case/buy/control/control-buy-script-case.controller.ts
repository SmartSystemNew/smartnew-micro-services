import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import BuyControlQuotationRepository from 'src/repositories/buy-control-quotation-repository';

@ApiTags('Script Case - Buy - Control')
@Controller('/script-case/buy/control')
export default class BuyControlController {
  constructor(
    private buyControlQuotationRepository: BuyControlQuotationRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/quotation')
  async list(@Req() req) {
    const user: IUserInfo = req.user;

    const controlQuotation =
      await this.buyControlQuotationRepository.listByClient(user.clientId);

    return controlQuotation;
  }
}
