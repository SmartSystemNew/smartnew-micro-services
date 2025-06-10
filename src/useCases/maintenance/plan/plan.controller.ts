import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { PlanDescriptionRepository } from 'src/repositories/plan-description-repository';
import { PlanMaintenanceRepository } from 'src/repositories/plan-maintenance-repository';
import {
  getArrayMapper,
  PlanDescriptionMapper,
  PlanMaintenanceMapper,
  removeExtraFields,
  setMapper,
  unSetMapper,
} from 'src/service/mapper.service';
import { MessageService } from 'src/service/message.service';
import { querySearchParam } from 'src/service/queryFilters.service';
import { PlanDescriptionBody } from './dtos/plan-description-body';
import { PlanMaintenanceBody } from './dtos/plan-maintenance-body';
import { PlanDescriptionSwaggerResponse } from './dtos/swagger/plan-description-swagger';

@ApiTags('Maintenance - Plan')
@ApiBearerAuth()
@Controller('/maintenance/plan')
export default class PlanController {
  constructor(
    private planDescriptionRepository: PlanDescriptionRepository,
    private planMaintenanceRepository: PlanMaintenanceRepository,
  ) {}

  /**
   * Retrieves a list of maintenance description plans based on the provided query parameters.
   *
   * @param req - The request object containing user information.
   * @param query - The query parameters for filtering and selecting fields.
   *
   * @returns An object containing the filtered and mapped maintenance description plans.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @Get('/description')
  @ApiOkResponse({
    description: 'Success',
    type: PlanDescriptionSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listPlanDescription(@Req() req, @Query() query) {
    const user: IUserInfo = req.user;
    const mapper = PlanDescriptionMapper;
    let { fields } = query;

    let filters = querySearchParam(query);
    filters = unSetMapper(filters, mapper);

    fields = getArrayMapper(fields, mapper);

    const data = await this.planDescriptionRepository.listByClient(
      user.clientId,
      filters,
      fields,
    );

    const response = data.map((obj) => {
      const objMapper = setMapper(obj, mapper);

      return objMapper;
    });

    return {
      data: response,
    };
  }

  /**
   * Handles the creation of a new maintenance description plan.
   *
   * @param req - The request object containing user information.
   * @param body - The data for the new maintenance plan.
   *
   * @returns An object indicating the success of the operation and the created description plan data.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   * @throws NotFoundException - If the plan with the given id does not exist.
   * @throws BadRequestException - If there is an error creating the plan.
   */
  @UseGuards(AuthGuard)
  @Post('/description')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Plan_id_not_found,
  })
  async createPlanDescription(@Req() req, @Body() body: PlanDescriptionBody) {
    const user: IUserInfo = req.user;
    const mapper = PlanDescriptionMapper;

    const fields_permission = [
      'idSubGroup',
      'branch',
      'idFamilyEquipe',
      'description',
      'logo',
    ];

    if (body.logo) {
      body.logo = Buffer.from(body.logo);
    }

    removeExtraFields(body, fields_permission);
    body['username'] = user && user.login;
    body['idClient'] = user && req.user.clientId;
    body['dateEmission'] = new Date();

    const data = unSetMapper(body, mapper);
    try {
      const newObject = await this.planDescriptionRepository.create(data);
      return {
        created: true,
        data: newObject,
      };
    } catch (error) {
      throw new BadRequestException(MessageService.Create_fail);
    }
  }

  /**
   * Retrieves a specific description plan of maintenance by its unique identifier.
   *
   * @param id - The unique identifier of the plan to be retrieved.
   *
   * @returns The requested description plan of maintenance, or throws an error if not found.
   *
   * @throws NotFoundException - If the plan with the given id does not exist.
   */
  @UseGuards(AuthGuard)
  @Get('/description/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Plan_id_not_found,
  })
  async getPlan(@Param('id') id: string) {
    const mapper = PlanDescriptionMapper;

    const obj = await this.planDescriptionRepository.findById(Number(id));

    if (!obj) {
      throw new NotFoundException(MessageService.Plan_id_not_found);
    }

    const response = setMapper(obj, mapper);

    return response;
  }

  /**
   * Updates a specific description plan of maintenance in the system.
   *
   * @param req - The request object containing user information.
   * @param id - The unique identifier of the description plan to be updated.
   * @param body - The updated plan data.
   *
   * @returns An object containing the status of the update operation and the updated plan data.
   *
   * @throws NotFoundException - If the plan with the given id does not exist.
   * @throws BadRequestException - If there is an error updating the plan.
   */
  @UseGuards(AuthGuard)
  @Put('/description/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Plan_id_not_found,
  })
  async updatePlanDescription(
    @Req() req,
    @Param('id') id: string,
    @Body() body: PlanDescriptionBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = PlanDescriptionMapper;

    const fields_permission = [
      'idSubGroup',
      'branch',
      'idFamilyEquipe',
      'description',
      'logo',
    ];

    if (body.logo) {
      body.logo = Buffer.from(body.logo);
    }

    removeExtraFields(body, fields_permission);
    body['username'] = user && user.login;
    body['idClient'] = user && req.user.clientId;
    body['dateEmission'] = new Date();

    const obj = await this.planDescriptionRepository.findById(Number(id));
    if (!obj) {
      throw new NotFoundException(MessageService.Plan_id_not_found);
    }

    const data = unSetMapper(body, mapper);
    try {
      const newObject = await this.planDescriptionRepository.update(
        Number(id),
        data,
      );
      return {
        updated: true,
        data: newObject,
      };
    } catch (error) {
      throw new BadRequestException(MessageService.Update_fail);
    }
  }

  /**
   * Deletes a specific description plan of maintenance in the system.
   *
   * @param id - The unique identifier of the description plan to be deleted.
   *
   * @returns An object containing the status of the deletion operation.
   *
   * @throws NotFoundException - If the plan with the given id does not exist.
   * @throws BadRequestException - If there is an error deleting the plan.
   */
  @UseGuards(AuthGuard)
  @Delete('/description/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Plan_id_not_found,
  })
  async deletePlan(@Param('id') id: string) {
    try {
      await this.planDescriptionRepository.delete(Number(id));
      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(MessageService.Delete_fail);
    }
  }

  /**
   * Retrieves a list of maintenance plan items based on the provided plan description ID.
   *
   * @param idPlanDescription - The unique identifier of the maintenance plan description.
   *
   * @returns An array of maintenance plan items associated with the given plan description ID.
   *
   * @throws NotFoundException - If the plan description with the given ID does not exist.
   */
  @UseGuards(AuthGuard)
  @Get('/:id_plan_description')
  @ApiOkResponse({
    description: 'Success',
    type: PlanMaintenanceBody,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Plan_id_not_found,
  })
  async listPlan(@Param('id_plan_description') idPlanDescription: string) {
    const mapper = PlanMaintenanceMapper;
    const plan = await this.planDescriptionRepository.findById(
      Number(idPlanDescription),
    );

    if (!!!plan) {
      throw new NotFoundException(MessageService.Plan_id_not_found);
    }

    const data = await this.planMaintenanceRepository.listByPlanDescription(
      Number(idPlanDescription),
    );
    Object.keys(data).map((key) => {
      data[key] = setMapper(data[key], mapper);
    });
    return data;
  }

  /**
   * Handles the creation of a new maintenance plan item associated with a specific plan description.
   *
   * @param req - The request object containing user information.
   * @param idPlanDescription - The unique identifier of the maintenance plan description.
   * @param body - The data for the new maintenance plan item.
   *
   * @returns An object indicating the success of the operation and the created maintenance plan item data.
   *
   * @throws NotFoundException - If the plan description with the given ID does not exist.
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @Post('/:id_plan_description')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Plan_id_not_found,
  })
  async createPlanMaintenance(
    @Req() req,
    @Param('id_plan_description') idPlanDescription: string,
    @Body() body: Partial<PlanMaintenanceBody>,
  ) {
    const user: IUserInfo = req.user;
    const mapper = PlanMaintenanceMapper;
    const plan = await this.planDescriptionRepository.findById(
      Number(idPlanDescription),
    );
    if (!!!plan) {
      throw new NotFoundException(MessageService.Plan_id_not_found);
    }
    const fields_permission = [
      'order',
      'idSectorExecutor',
      'idComponent',
      'unitDay',
      'periodicityDay',
      'required',
      'timeHH',
      'requireImage',
    ];
    removeExtraFields(body, fields_permission);
    body['idPlanDescription'] = Number(idPlanDescription);
    body['username'] = user && user.login;
    body['dateEmission'] = new Date();

    const data = unSetMapper(body, mapper);

    const obj = await this.planMaintenanceRepository.create(data);

    return {
      inserted: true,
      data: obj,
    };
  }
}
