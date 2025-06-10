import { ApiProperty } from '@nestjs/swagger';

class Branch {
  @ApiProperty()
  id: number;
  @ApiProperty()
  label: string;
  @ApiProperty()
  numberBranch: string;
  @ApiProperty()
  name: string;
}
class Equipment {
  @ApiProperty()
  id: number;
  @ApiProperty()
  label: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  numberSerie: string;
}
class Type {
  @ApiProperty()
  id: number;
  @ApiProperty()
  label: string;
  @ApiProperty()
  typeMaintenance: string;
}
class Sector {
  @ApiProperty()
  id: number;
  @ApiProperty()
  label: string;
  @ApiProperty()
  description: string;
}

class DataGetServiceOrder {
  @ApiProperty()
  id: number;
  @ApiProperty()
  codeServiceOrder: string;
  @ApiProperty()
  dateTimeRequest: Date;
  @ApiProperty()
  dateEmission: Date;
  @ApiProperty()
  idServiceOrderFather: string | null;
  @ApiProperty()
  idClient: number;
  @ApiProperty()
  LinkServiceOrder: string | null;
  @ApiProperty({ type: Branch })
  branch: Branch;
  @ApiProperty({ type: Equipment })
  equipment: Equipment;
  @ApiProperty()
  descriptionRequest: string;
  @ApiProperty()
  descriptionServicePerformed: string | null;
  @ApiProperty()
  comments: string | null;
  @ApiProperty()
  observationsExecutor: string | null;
  @ApiProperty({ type: Type })
  typeMaintenance: Type;
  @ApiProperty()
  idStatusServiceOrder: number;
  @ApiProperty()
  dateExpectedEnd: Date | null;
  @ApiProperty()
  request: string;
  @ApiProperty()
  maintainers: string | null;
  @ApiProperty()
  hourPrev: string | null;
  @ApiProperty()
  machineStop: number;
  @ApiProperty()
  hourMeter: string | null;
  @ApiProperty()
  odometer: string | null;
  @ApiProperty()
  dateEquipamentoStop: Date | null;
  @ApiProperty()
  dateEquipmentWorked: Date | null;
  @ApiProperty()
  servicePending: string | null;
  @ApiProperty()
  hasAttachment: string | null;
  @ApiProperty({ type: Sector })
  sectorExecutor: Sector;
}

export class GetServiceOrderSwaggerResponse {
  @ApiProperty({ type: DataGetServiceOrder })
  data: DataGetServiceOrder;
}
