export default interface InfoDashResponse {
  name: string;
  tank: {
    name: string;
    type: 'internal' | 'external';
    maxCapacity: number;
    quantity: number;
  }[];
}
