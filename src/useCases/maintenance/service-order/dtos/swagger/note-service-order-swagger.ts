import { ApiProperty } from '@nestjs/swagger';

class RelatedServiceOrder {
  @ApiProperty()
  id: number;
  @ApiProperty()
  ordem: string;
}
class RelatedStatusServiceOrder {
  id: number;
  status: string;
}
class RelatedBranch {
  @ApiProperty()
  id: number;
  @ApiProperty()
  branchNumber: string;
}
class RelatedCompany {
  @ApiProperty()
  id: number;
  @ApiProperty()
  companyName: string;
}
class RelatedEmployee {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
class relatedEquipment {
  @ApiProperty()
  id: number;
  @ApiProperty()
  codeEquipment: string;
}

class Data {
  @ApiProperty()
  id: number;
  @ApiProperty()
  description: string | null;
  @ApiProperty()
  comments: string | null;
  @ApiProperty()
  tasks: string | null;
  @ApiProperty()
  date: string | null;
  @ApiProperty()
  dateStartHour: Date | null;
  @ApiProperty()
  dateEndHour: Date | null;
  @ApiProperty()
  realTime: string | null;
  @ApiProperty()
  hourValue: string | null;
  @ApiProperty()
  typeMaintenance: string | null;
  @ApiProperty()
  finished: number;
  @ApiProperty()
  idProject: number;
  @ApiProperty()
  dateEmission: Date;
  @ApiProperty()
  username: string | null;
  @ApiProperty()
  @ApiProperty()
  aux: string | null;

  @ApiProperty()
  idEquipment: number | null;
  @ApiProperty()
  @ApiProperty({ isArray: false, type: relatedEquipment })
  relatedEquipment: relatedEquipment;

  @ApiProperty()
  idClient: number | null;
  @ApiProperty({ isArray: false, type: RelatedCompany })
  relatedCompany: RelatedCompany;

  @ApiProperty()
  idBranch: number | null;
  @ApiProperty({ isArray: false, type: RelatedBranch })
  relatedBranch: RelatedBranch;

  @ApiProperty()
  idServiceOrder: number | null;
  @ApiProperty({ isArray: false, type: RelatedServiceOrder })
  relatedServiceOrder: RelatedServiceOrder;

  @ApiProperty()
  idStatusServiceOrder: number | null;
  @ApiProperty({ isArray: false, type: RelatedStatusServiceOrder })
  relatedStatusServiceOrder: RelatedStatusServiceOrder;

  @ApiProperty()
  idEmployee: number | null;
  @ApiProperty({ isArray: false, type: RelatedEmployee })
  relatedEmployee: RelatedEmployee;
}

export class NoteServiceOrderSwaggerResponse {
  @ApiProperty({ isArray: true, type: Data })
  data: Data[];
}
