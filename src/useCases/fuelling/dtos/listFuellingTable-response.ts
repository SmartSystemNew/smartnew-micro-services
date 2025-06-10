import { Decimal } from '@prisma/client/runtime/library';

export default interface ListFuellingResponse {
  id: number;
  equipment: string;
  fuelStation: string | null;
  train: string | null;
  //trainFuelling: string | null;
  compartment: string | null;
  tank: string | null;
  //tankFuelling: string | null;
  fiscalNumber: string | null;
  requestNumber: string | null;
  driver: string | null;
  supplier: string | null;
  user: string | null;
  date: Date;
  value: Decimal;
  quantidade: Decimal;
  observation: string | null;
  type: string;
}
