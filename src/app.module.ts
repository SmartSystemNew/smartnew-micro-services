// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
// import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ENVService } from './service/env.service';
import { ConfigModule } from '@nestjs/config';
import { DateService } from './service/data.service';
//import { Gps7ImportEquipmentTask } from './service/gps7.tasks.service';
import { PrismaModule } from './database/prisma.module';
import { PrismaService } from './database/prisma.service';
import DescriptionPlanningService from './service/descriptionPlanning.service';
import { serviceModule } from './useCases/service/service.module';

//import { RequestContextService } from './service/request-context.service';

@Global()
@Module({
  exports: [
    PrismaService,
    // TenantPrismaService,
    // BankBoundService,
    // //RequestContextService,
    // ContextService,
  ],
  imports: [
    PrismaModule,
    //loginModule,
    //TenantRepositoriesModule,
    serviceModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   //include: [loginModule],
    //   autoSchemaFile: 'src/schema.gql',
    // }),
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    ENVService,
    DateService,
    DescriptionPlanningService,
    //Gps7ImportEquipmentTask,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(TenantMiddleware).forRoutes('*');
  // }
}
