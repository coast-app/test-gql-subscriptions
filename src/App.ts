import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class App {
  @Field()
  public message: string;
}
