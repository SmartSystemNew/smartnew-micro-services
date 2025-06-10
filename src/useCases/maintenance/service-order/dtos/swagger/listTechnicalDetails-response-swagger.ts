import { ApiResponseProperty } from '@nestjs/swagger';
import { DataSelectResponse } from 'src/models/swagger/select-response-swagger';

class DataResponse {
  @ApiResponseProperty({
    type: String,
  })
  maintenanceDiagnosis: string;

  @ApiResponseProperty({
    type: String,
  })
  solution: string;

  @ApiResponseProperty({
    type: String,
  })
  executorObservation: string;

  @ApiResponseProperty({
    type: Date,
  })
  technicalDrive: Date;

  @ApiResponseProperty({
    type: Date,
  })
  technicalArrival: Date;

  @ApiResponseProperty({
    type: String,
  })
  serviceEvaluationNote: number;

  @ApiResponseProperty({
    type: DataSelectResponse,
  })
  priority: {
    value: string;
    text: string;
  } | null;

  @ApiResponseProperty({
    type: DataSelectResponse,
  })
  classification: {
    value: string;
    text: string;
  } | null;
}

export default class listTechnicalDetailsResponseSwagger {
  @ApiResponseProperty({
    type: DataResponse,
  })
  data: DataResponse;
}
