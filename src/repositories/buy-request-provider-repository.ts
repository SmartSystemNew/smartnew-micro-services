export default abstract class BuyRequestProviderRepository {
  abstract delete(id: number): Promise<boolean>;
}
