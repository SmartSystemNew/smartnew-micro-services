import IFinanceTributes from 'src/models/IFinanceTributes';

export default abstract class FinanceTributesRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<IFinanceTributes['listByClient'][]>;

  abstract findById(id: number): Promise<IFinanceTributes['findById']>;
}
