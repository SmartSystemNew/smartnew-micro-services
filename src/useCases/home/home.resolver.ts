import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HomeResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello HomeResolver';
  }
}
