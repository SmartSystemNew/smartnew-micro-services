export class ChangeValueBasicForEquipment {
  clientId: number;
  data: {
    equipment: string;
    date: string | Date | number;
    lastHour: string;
    nowHour: string;
  }[];
}
