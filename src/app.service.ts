import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
//@Injectable()
export class AppService {
  @Query(() => String)
  getHello(): string {
    return 'Servidor ONLINE';
  }
}
