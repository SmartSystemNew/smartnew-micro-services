export default interface GenerateExcelQuery {
  type: 'pagar' | 'receber';
  date_from?: Date | null;
  date_to?: Date | null;
  status: string;
  typePayment: string;
  issued: boolean | null;
  globalFilter: string | null;
  filterText: string | null;
  filterColumn: string | null;
  isExtension: boolean;
}
