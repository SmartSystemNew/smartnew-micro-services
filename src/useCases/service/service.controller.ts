import { Controller, Get, Post, Req } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { DateService } from 'src/service/data.service';
import DescriptionPlanningService from 'src/service/descriptionPlanning.service';
//import DescriptionPlanningService from 'src/service/descriptionPlanning.service';
import { ENVService } from 'src/service/env.service';
import { z } from 'zod';

@ApiTags('Service')
@Controller('/service')
export default class ServiceController {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    //private prismaService: PrismaService, // Serviço do Prisma para acessar o banco
    private envService: ENVService,
    private dateService: DateService,
  ) {}

  @Get('/planning')
  async list() {}

  @Post('/planning')
  async createServicePlanning(@Req() req) {
    const bodySchema = z.object({
      bankId: z.number().optional().default(1),
      taskId: z.number(),
    });

    const body = bodySchema.parse(req.body);

    //console.log(body);

    const cronJob = await new DescriptionPlanningService(
      this.schedulerRegistry,
      this.envService,
      this.dateService,
    ).createJob(body.bankId, body.taskId);

    return {
      success: true,
      message: 'CronJob Planejamento Criado!',
      cronJob,
    };
  }
}
