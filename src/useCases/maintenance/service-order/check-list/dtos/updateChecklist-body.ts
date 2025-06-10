export default class UpdateChecklistBody {
  checklist: {
    id: number;
    answer: number;
    children?: number | null;
    observation: string;
  }[];
}
