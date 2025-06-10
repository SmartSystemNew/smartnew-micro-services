export default interface IExportPDFResponse {
  description: string;
  responsible: string;
  logo: string;
  status: string;
  deadline: Date;
  pendencies: Array<{
    equipment: string;
    createdAt: Date;
    verify: string;
    attach: string[];
  }>;
  done: {
    doneAt: Date;
    descriptionAction: string;
    attach: string[];
  };
}
