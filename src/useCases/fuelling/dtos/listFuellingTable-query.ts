export default interface ListFuellingTableQuery {
  perPage?: number;
  index?: number;
  equipment?: number[];
  type?: 'INTERNO' | 'EXTERNO';
  product?: number[];
  dateFrom?: Date;
  dateTo?: Date;
}
