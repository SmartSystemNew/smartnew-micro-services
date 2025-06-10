import { IsIn } from 'class-validator';

export default class ListFinanceQuery {
  @IsIn(['pagar', 'receber'])
  type: 'pagar' | 'receber';
}
