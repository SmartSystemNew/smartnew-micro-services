export default interface ImportPlansR2Body {
  clientId: number;
  descriptionPlan: string;
  equipment: string;
  sector?: string;
  typeMaintenance?: string;
  task: string;
  unity: string;
  priorityUse: number;
}
