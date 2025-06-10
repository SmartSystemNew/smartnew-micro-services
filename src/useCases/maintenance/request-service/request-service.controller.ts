import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import RequestServiceRepository from 'src/repositories/request-service-repository';
import { DateService } from 'src/service/data.service';
import ListForApiBody from './dtos/listForApi-body';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Maintenance - Request Service')
@Controller('/maintenance/request-service')
export default class RequestServiceController {
  constructor(
    private requestServiceRepository: RequestServiceRepository,
    private dateService: DateService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/list')
  async listForApi(@Req() req, @Query() query: ListForApiBody) {
    const user: IUserInfo = req.user;
    const minDate = this.dateService
      .dayjs(new Date())
      .subtract(Number(query.day), 'day')
      .toDate();

    const allRequest = await this.requestServiceRepository.listByClient(
      user.clientId,
      minDate,
    );
    const response = allRequest.map((value) => {
      return {
        id: value.id,
        filial: value.branch.filial_numero,
        equipamento: value.equipment
          ? `${value.equipment.equipamento_codigo}-${value.equipment.descricao}`
          : '',
        order_servico: value.orderService
          ? `${value.orderService.ordem}-${value.orderService.descricao_solicitacao}`
          : '',
        setor_executante: value.sectorExecutor
          ? value.sectorExecutor.descricao
          : '',
        assunto: value.assunto,
        mensagem: value.mensagem,
        prioridade: value.prioridade,
        status: value.statusRequest ? value.statusRequest.descricao : '',
        data_inicio: value.data_inicio,
        data_termino: value.data_termino,
        log_date: value.log_date,
      };
    });

    return response;
  }
}
