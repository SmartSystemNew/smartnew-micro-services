class ResponseData {
  id: string;

  response: string;
}

export default class UpdateAskBody {
  responses: ResponseData[];

  paymentType: string;

  quantityInstallments: string;

  dueDate: Date;

  frequency: number;

  fixFrequency: string;

  installment: string;
}
