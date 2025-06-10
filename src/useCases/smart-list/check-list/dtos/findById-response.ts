export interface findByIdResponse {
  id: number;
  status: string;
  startDate: Date;
  endDate: Date;
  item: string;
  // equipment: string;
  // location: string;
  user: string;
  model: string;
  tasks: {
    id: number;
    description: string;
    answer: {
      id: number;
      description: string;
      color: string;
      icon: string;
      observation: string;
      children: { id: number; description: string } | null;
    } | null;
  }[];
}
