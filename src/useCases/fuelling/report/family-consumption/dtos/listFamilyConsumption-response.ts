export default interface ListFamilyConsumptionResponse {
  family: string;
  fuelling: {
    equipmentId: number;
    equipment: string;
    typeConsumption: string;
    expectedConsumption: number | null;
    quantity: number;
    total: number;
    consumptionMade: number | null;
    sumConsumption: number;
    quantityEquipment: number;
    difference: number;
  }[];
}
