import { ApiProperty } from '@nestjs/swagger';

class DateCalendar {
  @ApiProperty({
    type: 'string',
    description: 'Data',
  })
  date: string;

  @ApiProperty({
    type: 'string',
    description: 'Dia da Semana da data',
  })
  dayOfWeek: string;
}

class ServiceItemCalendar {
  @ApiProperty({
    type: 'number',
    description: 'Id da ordem de serviço',
  })
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Codigo da Ordem de Servico',
  })
  description: string;

  @ApiProperty({
    type: 'string',
    description: 'Filial da Ordem de Servico',
  })
  branch: string;

  @ApiProperty({
    type: 'string',
    description: 'Duração da ordem de Servico',
  })
  timeLeft: string;

  @ApiProperty({
    type: Date,
    description: 'Data Atual',
  })
  scheduledDate: Date;

  @ApiProperty({
    type: 'string',
    description: 'Status da Ordem de Servico',
  })
  status: string;
}

class ServiceCalendar {
  @ApiProperty({
    type: [ServiceItemCalendar],
    description: 'Itens de Ordem de Serviço do Dia',
  })
  data: ServiceItemCalendar[];
}

class MaintainerCalendar {
  @ApiProperty({
    type: 'string',
    description: 'Nome Mantenedor',
  })
  name: string;

  @ApiProperty({
    type: [ServiceCalendar],
    description: 'Ordem de Serviços do Mantenedor',
  })
  services: ServiceCalendar;
}

export default class listCalendarMaintainerResponseSwagger {
  @ApiProperty({
    type: [DateCalendar],
    description: 'Datas do Calendário',
  })
  dates: DateCalendar[];

  @ApiProperty({
    type: [MaintainerCalendar],
    description: 'Calendário dos Mantenedores',
  })
  maintainers: MaintainerCalendar[];
}
