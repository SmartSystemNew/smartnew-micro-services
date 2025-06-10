import { ApiProperty } from '@nestjs/swagger';

class TaskSchema {
  @ApiProperty({
    type: 'number',
  })
  id: number;

  @ApiProperty({
    type: 'string',
  })
  task: string;
}

class ChecklistSchema {
  @ApiProperty({
    type: 'number',
  })
  id: number;

  @ApiProperty({
    type: 'string',
  })
  equipment: string;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  dateStart: Date | null;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  dateEnd: Date | null;

  @ApiProperty({
    type: TaskSchema,
    isArray: true,
  })
  item: [
    {
      id: number;
      task: string;
    },
  ];
}

class ListChecklistSchema {
  @ApiProperty({
    type: 'number',
  })
  modelId: number;

  @ApiProperty({
    type: 'string',
  })
  modelDescription: string;

  @ApiProperty({
    type: ChecklistSchema,
    isArray: true,
  })
  checklist: [
    {
      id: number;
      equipment: string;
      dateStart: Date | null;
      dateEnd: Date | null;
      item: [
        {
          id: number;
          task: string;
        },
      ];
    },
  ];
}

export default class ListChecklistResponseSwagger {
  @ApiProperty({
    type: ListChecklistSchema,
    isArray: true,
  })
  data: ListChecklistSchema[];
}
