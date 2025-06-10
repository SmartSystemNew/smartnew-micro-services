import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateOneUserObject {
  @Field()
  name: string;
  @Field()
  email: string;
}
