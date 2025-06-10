import { ArgsType, Field } from '@nestjs/graphql';
import { CreateOneUserInput } from '../inputs/create-one-user.input';

@ArgsType()
export class CreateOneUserArgs {
  @Field()
  data: CreateOneUserInput;
}
