import { Decimal } from '@prisma/client/runtime/library';

export default interface FindByIdResponse {
  id: number;
  tank: string;
  model: string;
  stock: number;
  odometer: number;
  current: number;
  capacity: number;
  branch: {
    value: number;
    label: string;
  };
  compartment: {
    id: number;
    capacity: number;
    quantity: number;
    fuel: {
      value: number;
      label: string;
    };
    fuelling: {
      id: number;
      date: Date;
      quantity: Decimal;
      fuel: {
        value: number;
        label: string;
      };
    }[];
    tankInlet: {
      id: number;
      date: Date;
      quantity: number;
      fuel: {
        value: number;
        label: string;
      };
    }[];
  }[];
}
