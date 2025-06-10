import { ApiProperty } from '@nestjs/swagger';

class TaskPlanning {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
  })
  taskId: number;

  @ApiProperty({
    type: Number,
  })
  task: string;
}

class ListDescriptionPlanWithTask {
  @ApiProperty({
    type: Number,
  })
  value: number;

  @ApiProperty({
    type: String,
  })
  label: string;

  @ApiProperty({
    type: [TaskPlanning],
  })
  taskPlanning: TaskPlanning[];
}

export class ListDescriptionPlanWithTaskResponseSwagger {
  @ApiProperty({
    type: [ListDescriptionPlanWithTask],
  })
  data: ListDescriptionPlanWithTask[];
}
