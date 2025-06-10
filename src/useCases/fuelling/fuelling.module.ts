import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { FTPService } from 'src/service/ftp.service';
import FuellingController from './fuelling.controller';
// import { FuelStationRepository } from 'src/repositories/fuel-station-repository';
// import FuelStationRepositoryPrisma from 'src/repositories/prisma/fuel-station-repository-prisma';
// import TankRepositoryPrisma from 'src/repositories/prisma/tank-repository-prisma';
// import { TankRepository } from 'src/repositories/tank-repository';
// import { FuelRepository } from 'src/repositories/fuel-repository';
// import FuelRepositoryPrisma from 'src/repositories/prisma/fuel-repository-prisma';
// import { FuellingRepository } from 'src/repositories/fuelling-repository';
// import FuellingRepositoryPrisma from 'src/repositories/prisma/fuelling-repository-prisma';
// import { FuellingControlUserRepository } from 'src/repositories/fuelling-control-user-repository';
// import FuellingControlUserRepositoryPrisma from 'src/repositories/prisma/fuelling-control-user-repository-prisma';
// import EquipmentRepository from 'src/repositories/equipment-repository';
// import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
// import fuellingTrainRepository from 'src/repositories/fuelling-train-repository';
// import fuellingTrainRepositoryPrisma from 'src/repositories/prisma/fuelling-train-repository-prisma';
// import FuellingTankCompartmentRepository from 'src/repositories/fuelling-tank-compartment-repository';
// import FuellingTankCompartmentRepositoryPrisma from 'src/repositories/prisma/fuelling-tank-compartment-repository-prisma';
// import FuellingTrainCompartmentRepository from 'src/repositories/fuelling-train-compartment-repository';
//import FuellingTrainCompartmentRepositoryPrisma from 'src/repositories/prisma/fuelling-train-compartment-repository-prisma';
import { DateService } from 'src/service/data.service';
import { FileService } from 'src/service/file.service';
import TankController from './tank/tank.controller';
import TrainController from './train/train.controller';
// import { BranchRepository } from 'src/repositories/branch-repository';
// import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
import InputController from './input/input.controller';
// import FuellingInputFuelRepository from 'src/repositories/fuelling-input-fuel-repository';
// import FuellingInputFuelRepositoryPrisma from 'src/repositories/prisma/fuelling-input-fuel-repository-prisma';
// import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
// import ProviderRepository from 'src/repositories/provider-repository';
// import FuellingInputProductRepository from 'src/repositories/fuelling-input-product-repository';
// import FuellingInputProductRepositoryPrisma from 'src/repositories/prisma/fuelling-input-product-prisma';
// import FuellingControlRepository from 'src/repositories/fuelling-control-repository';
// import FuellingControlRepositoryPrisma from 'src/repositories/prisma/fuelling-control-repository-prisma';
import ProductController from './product/product.controller';
// import FuellingProductRepository from 'src/repositories/fuelling-product-repository';
// import FuellingProductRepositoryPrisma from 'src/repositories/prisma/fuelling-product-repository-prisma';
import FuellingControlUserController from './control-user/fuelling-control-user.controller';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import FuellingControlController from './control/fuelling-control.controller';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import FuellingAppController from './app/app.controller';
import ControlFuellingController from './report/control-fuelling/controlFuelling.controller';
import FamilyConsumptionController from './report/family-consumption/family-consumption.controller';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';

@Module({
  imports: [
    //TankModule,
    //TrainModule,
    //FuellingAppModule,
    // FuellingReportModule
    TenantRepositoriesModule,
  ],
  controllers: [
    TrainController,
    TankController,
    InputController,
    ProductController,
    FuellingControlController,
    FuellingControlUserController,
    FuellingController,
    TankController,
    TrainController,
    FuellingAppController,
    ControlFuellingController,
    FamilyConsumptionController,
  ],
  providers: [
    JwtService,
    ENVService,
    FileService,
    FTPService,
    DateService,
    // {
    //   provide: BranchRepository,
    //   useClass: BranchRepositoryPrisma,
    // },
    // {
    //   provide: BranchesByUserRepository,
    //   useClass: BranchesByUserRepositoryPrisma,
    // },
    // // {
    // //   provide: LoginRepository,
    // //   useClass: LoginRepositoryPrisma,
    // // },
    // {
    //   provide: UserRepository,
    //   useClass: UserRepositoryPrisma,
    // },
    // {
    //   provide: PermissionRepository,
    //   useClass: PermissionRepositoryPrisma,
    // },
    // {
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    // {
    //   provide: FuelStationRepository,
    //   useClass: FuelStationRepositoryPrisma,
    // },
    // {
    //   provide: TankRepository,
    //   useClass: TankRepositoryPrisma,
    // },
    // {
    //   provide: FuellingTankCompartmentRepository,
    //   useClass: FuellingTankCompartmentRepositoryPrisma,
    // },
    // {
    //   provide: FuelRepository,
    //   useClass: FuelRepositoryPrisma,
    // },
    // {
    //   provide: FuellingRepository,
    //   useClass: FuellingRepositoryPrisma,
    // },
    // {
    //   provide: FuellingControlUserRepository,
    //   useClass: FuellingControlUserRepositoryPrisma,
    // },
    // {
    //   provide: EquipmentRepository,
    //   useClass: EquipmentRepositoryPrisma,
    // },
    // {
    //   provide: fuellingTrainRepository,
    //   useClass: fuellingTrainRepositoryPrisma,
    // },
    // {
    //   provide: FuellingTrainCompartmentRepository,
    //   useClass: FuellingTrainCompartmentRepositoryPrisma,
    // },
    // {
    //   provide: FuellingInputFuelRepository,
    //   useClass: FuellingInputFuelRepositoryPrisma,
    // },
    // {
    //   provide: ProviderRepository,
    //   useClass: ProviderRepositoryPrisma,
    // },
    // {
    //   provide: FuellingInputProductRepository,
    //   useClass: FuellingInputProductRepositoryPrisma,
    // },
    // {
    //   provide: FuellingControlRepository,
    //   useClass: FuellingControlRepositoryPrisma,
    // },
    // {
    //   provide: FuellingProductRepository,
    //   useClass: FuellingProductRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
  ],
})
export class fuellingModule {}
