import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOneUserArgs } from './args/createOneUser.args';
import { CreateOneUserObject } from './objects/create-one-user.objects';

@Resolver()
export class UserResolver {
  @Query(() => String)
  users() {
    return 'Hello World';
  }

  @Mutation(() => CreateOneUserObject)
  createOneUser(@Args() args: CreateOneUserArgs) {
    return args.data;
  }
}
