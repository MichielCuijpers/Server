import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { DID, Tag, Challenge } from '.';
import { Agreement } from './Agreement';

@Entity()
@ObjectType()
export class Project extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Field(() => String)
  @Column()
  name: string = '';

  @Field(() => String)
  @Column()
  description: string = '';

  @Field(() => String)
  @Column()
  lifecyclePhase: string = '';

  @Field(() => [Tag])
  @OneToMany(
    type => Tag,
    tag => tag.project,
    { eager: true },
  )
  tags!: Tag[];
  
  @Field(() => DID)
  @OneToOne(type => DID, did => did.project)
  DID!: DID;

  @Field(() => [Agreement])
  @OneToMany(
    type => Agreement,
    agreement => agreement.project,
    { eager: true },
  )
  agreements!: Agreement[];


  @ManyToOne(
    type => Challenge,
    challenge => challenge.projects
  )
  challenge!: Challenge;

  constructor(name: string) {
    super();
    this.name = name;
  }

}