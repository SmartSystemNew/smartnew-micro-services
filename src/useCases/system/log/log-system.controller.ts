import { Body, Controller, Get, Post } from '@nestjs/common';
import LogChecklistRepository from 'src/repositories/log-checklist-repository';
import CreateLogChecklistBody from './dtos/createLogChecklist-body';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('System - Log')
@Controller('/system/log')
export default class LogSystemController {
  constructor(private logChecklistRepository: LogChecklistRepository) {}

  @Get('/checklist')
  async listLogChecklist() {
    const log = await this.logChecklistRepository.list();

    return {
      data: log,
    };
  }
  @Post('/checklist')
  async createLogChecklist(@Body() body: CreateLogChecklistBody) {
    await this.logChecklistRepository.create({
      id_cliente: body.clientId,
      login: body.login,
      descricao: body.message,
      log_date: body.logDate,
    });

    return {
      register: true,
    };
  }
}
