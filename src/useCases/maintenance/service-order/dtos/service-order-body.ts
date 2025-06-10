import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class ServiceOrderBody {
  @ApiProperty()
  dateTimeRequest?: Date;

  @ApiProperty()
  @IsOptional()
  idServiceOrderFather?: number;

  @ApiProperty()
  @IsNumber()
  idBranch?: number;

  @ApiProperty()
  idEquipment?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idProgram?: number | null;

  @ApiProperty()
  @IsOptional()
  idSchedule?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idMaintenancePlan?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idPlanningMaintenance?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idCostCenter?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idBuilding?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idSector?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idDepartment?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idFamilyEquipment?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idTypeEquipment?: number;

  @ApiProperty()
  @IsOptional()
  LinkServiceOrder?: string;

  @ApiProperty()
  @IsOptional()
  branch?: string;

  @ApiProperty()
  @IsOptional()
  building?: string;

  @ApiProperty()
  @IsOptional()
  sector?: string;

  @ApiProperty()
  @IsOptional()
  department?: string;

  @ApiProperty()
  @IsOptional()
  familyEquipment?: string;

  @ApiProperty()
  @IsOptional()
  typeEquipment?: string;

  @ApiProperty()
  @IsOptional()
  equipment?: string;

  @ApiProperty()
  @IsOptional()
  model?: string;

  @ApiProperty()
  descriptionRequest?: string;

  @ApiProperty()
  @IsOptional()
  descriptionServicePerformed?: string;

  @ApiProperty()
  @IsOptional()
  comments?: string;

  @ApiProperty()
  @IsOptional()
  observationsExecutor?: string;

  @ApiProperty()
  @IsNumber()
  idTypeMaintenance?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idTpmTAG?: number;

  @ApiProperty()
  @IsOptional()
  codeTag?: number;

  @ApiProperty()
  idStatusServiceOrder?: number;

  @ApiProperty()
  @IsOptional()
  returnCheckList?: string;

  @ApiProperty()
  @IsOptional()
  closed?: string;

  @ApiProperty()
  @IsOptional()
  statusEquipment?: string;

  @ApiProperty()
  @IsOptional()
  statusSchedule?: string;

  @ApiProperty()
  @IsOptional()
  statusExecutante?: number;

  @ApiProperty()
  @IsOptional()
  dateExpectedEnd?: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateStart?: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateEnd?: Date;

  @ApiProperty()
  @IsOptional()
  requester?: string;

  @ApiProperty()
  @IsOptional()
  emission?: string;

  @ApiProperty()
  @IsOptional()
  idSubGroup?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idSectorExecutor?: number;

  @ApiProperty()
  @IsOptional()
  maintainers?: string[];

  @ApiProperty()
  hourPrev: string;

  @ApiProperty()
  hourReal: string;

  @ApiProperty()
  @IsOptional()
  costPredicted?: string;

  @ApiProperty()
  @IsOptional()
  costHours?: string;

  @ApiProperty()
  @IsOptional()
  costMaterial?: string;

  @ApiProperty()
  @IsOptional()
  costReleased?: string;

  @ApiProperty()
  @IsOptional()
  timeMachineStop?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty()
  @IsOptional()
  imageExpiration?: string;

  @ApiProperty()
  @IsOptional()
  location?: string;

  @ApiProperty()
  codePlanoMaintenance: string;

  @ApiProperty()
  @IsOptional()
  idSession?: string;

  @ApiProperty()
  @IsOptional()
  hourWorkLoad?: string;

  @ApiProperty()
  @IsOptional()
  workScale?: string;

  @ApiProperty()
  @IsOptional()
  startOperation?: string;

  @ApiProperty()
  @IsOptional()
  TerminoFuncionamento?: string;

  @ApiProperty()
  @IsOptional()
  clientComments?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  noteEvaluationService?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idProject?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idActionPlan?: number;

  @ApiProperty()
  @IsOptional()
  machineStop?: number | boolean;

  @ApiProperty()
  @IsOptional()
  hourMeter?: string;

  @ApiProperty()
  @IsOptional()
  odometer?: string;

  @ApiProperty()
  countPrint: number;

  @ApiProperty()
  @IsOptional()
  priority?: number;

  @ApiProperty()
  @IsOptional()
  classification?: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateEquipmentStop?: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateTechnicalActivation?: Date;

  @ApiProperty()
  @IsOptional()
  arrivalTechnician?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateEquipmentWorked?: Date;

  @ApiProperty()
  @IsOptional()
  occurrence?: string;

  @ApiProperty()
  @IsOptional()
  causeReason?: number;

  @ApiProperty()
  @IsOptional()
  statusFailure?: string;

  @ApiProperty()
  @IsOptional()
  servicePending?: string;

  @ApiProperty()
  @IsOptional()
  hasAttachment?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  idServiceRequest?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idProductionRegistration?: number;

  @ApiProperty()
  @IsOptional()
  aux?: string;

  @ApiProperty()
  idRequester?: number;

  @ApiProperty()
  @IsOptional()
  justify?: string | null;
}
