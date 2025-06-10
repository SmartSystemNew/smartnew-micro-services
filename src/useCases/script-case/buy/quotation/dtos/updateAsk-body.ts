class ResponseData {
  id: string;

  response: string;
}

export default class UpdateAskBody {
  responses: ResponseData[];

  paymentType: string;

  quantityInstallments: string;

  dueDate: Date;

  frequency: string;

  fixFrequency: string;

  installment: string;
}
