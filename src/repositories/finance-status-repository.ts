import IFinanceStatus from 'src/models/IFinanceStatus';

export default abstract class FinanceStatusRepository {
  abstract list(): Promise<IFinanceStatus['list'][]>;
}
