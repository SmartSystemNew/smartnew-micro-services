import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { MessageService } from 'src/service/message.service';
import { EmployeeRepository } from 'src/repositories/employee-repository';
import { querySearchParam } from 'src/service/queryFilters.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Buy - Employee')
@Controller('/employee')
export default class EmployeeController {
  constructor(private employeeRepository: EmployeeRepository) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async listEmployee(@Req() req, @Query() query) {
    const user: IUserInfo = req.user;

    const { fields } = query;

    const filters = querySearchParam(query);

    const data = await this.employeeRepository.listByClient(
      user.clientId,
      filters,
      fields,
    );

    const response = data.map((obj) => {
      return {
        ...obj,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findById(@Req() req, @Param('id') id: string) {
    const obj = await this.employeeRepository.findById(Number(id));

    if (!obj) {
      throw new NotFoundException(MessageService.Employee_id_not_found);
    }

    const response = {
      ...obj,
    };

    return {
      data: response,
    };
  }
}
