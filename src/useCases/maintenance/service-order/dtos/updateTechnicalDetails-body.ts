import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export default class updateTechnicalDetailsBody {
  @IsString()
  @IsOptional()
  maintenanceDiagnosis: string;

  @IsString()
  @IsOptional()
  solution: string;

  @IsString()
  @IsOptional()
  executorObservation: string;

  @IsDateString()
  @IsOptional()
  technicalDrive: Date;

  @IsDateString()
  @IsOptional()
  technicalArrival: Date;

  @IsNumber()
  @IsOptional()
  serviceEvaluationNote: number;

  // @IsNumber()
  // @IsOptional()
  // priority: number;

  @IsNumber()
  @IsOptional()
  classification: number;
}
