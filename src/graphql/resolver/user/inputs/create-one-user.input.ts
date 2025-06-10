import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOneUserInput {
  @Field()
  name: string;
  @Field()
  email: string;
}
