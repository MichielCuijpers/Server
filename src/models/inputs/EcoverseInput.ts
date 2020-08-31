import { InputType, Field } from 'type-graphql';
import { MaxLength } from 'class-validator';
import { TagInput, ChallengeInput, OrganisationInput, UserGroupInput, ContextInput, UserInput } from '.';
import { DeepPartial } from 'typeorm';
import { Ecoverse } from '..';

@InputType()
export class EcoverseInput implements DeepPartial<Ecoverse>{

  @Field()
  @MaxLength(30)
  name! : string;

  @Field(() => [ChallengeInput], { nullable: true })
  challenges?: ChallengeInput[];

  @Field(() => [OrganisationInput], { nullable: true })
  partners?: OrganisationInput[];

  @Field(() => [UserInput], { nullable: true })
  members?: UserInput[];

  @Field(() => [UserGroupInput], { nullable: true })
  groups?: UserGroupInput[];

  @Field({ nullable: true })
  context?: ContextInput;

  @Field( type => [TagInput], { nullable: true } )
  tags!: TagInput[];

}