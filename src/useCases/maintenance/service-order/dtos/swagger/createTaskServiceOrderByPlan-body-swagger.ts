import { ApiProperty } from '@nestjs/swagger';

class TaskServiceOrderByPlan {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: [Number],
  })
  taskId: number[];
}

export default class CreateTaskServiceOrderByPlanBodySwagger {
  @ApiProperty({
    type: [TaskServiceOrderByPlan],
  })
  plan: TaskServiceOrderByPlan[];
}
