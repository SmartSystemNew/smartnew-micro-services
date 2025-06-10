import { ISeed } from 'src/models/ISeed';

export default abstract class SeedRepository {
  abstract local(data: ISeed['local']): Promise<boolean>;
  abstract blank(data: ISeed['blank']): Promise<boolean>;
  abstract equipment(data: ISeed['equipment']): Promise<boolean>;
  abstract order(data: ISeed['order']): Promise<boolean>;
  abstract branchForCompany(data: ISeed['branchForCompany']): Promise<boolean>;
  abstract launchItemFinanceInHeaderImportForBranch(
    data: ISeed['launchItemFinanceInHeaderImportForBranch'],
  ): Promise<boolean>;
  abstract launchOrderServiceImportForBranch(
    data: ISeed['launchOrderServiceImportForBranch'],
  ): Promise<boolean>;
  abstract launchMaterialImportForBranch(
    data: ISeed['launchMaterialImportForBranch'],
  ): Promise<boolean>;
  abstract launchProviderImportForBranch(
    data: ISeed['launchProviderImportForBranch'],
  ): Promise<boolean>;
  abstract launchBuyImportForBranch(
    data: ISeed['launchBuyImportForBranch'],
  ): Promise<boolean>;
}
