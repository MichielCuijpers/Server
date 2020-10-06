import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Challenge, Context, DID, Organisation, Tagset, User, UserGroup, RestrictedGroupNames, RestrictedTagsetNames } from '.';
import { IEcoverse } from 'src/interfaces/IEcoverse';
import { IGroupable } from '../interfaces';

@Entity()
@ObjectType()
export class Ecoverse extends BaseEntity implements IEcoverse, IGroupable {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  // The context and host organisation
  @Field(() => String, { nullable: false, description: '' })
  @Column('varchar', { length: 100 })
  name: string;

  @Field(() => Organisation, { nullable: true, description: 'The organisation that hosts this Ecoverse instance' })
  @OneToOne(() => Organisation, { eager: true, cascade: true })
  @JoinColumn()
  host: Organisation;

  @Field(() => Context, { nullable: true, description: 'The shared understanding for the Ecoverse' })
  @OneToOne(() => Context, { eager: true, cascade: true })
  @JoinColumn()
  context: Context;

  // The digital identity for the Ecoverse - critical for its trusted role
  @OneToOne(() => DID, { eager: true, cascade: true })
  @JoinColumn()
  DID!: DID;

  @Field(() => [UserGroup], { nullable: true })
  @OneToMany(() => UserGroup, userGroup => userGroup.ecoverse, { eager: true, cascade: true })
  groups?: UserGroup[];

  @Field(() => [Organisation], {
    nullable: true,
    description: 'The set of partner organisations associated with this Ecoverse',
  })
  @ManyToMany(() => Organisation, organisation => organisation.ecoverses, { eager: true, cascade: true })
  @JoinTable({
    name: 'ecoverse_partner',
    joinColumns: [{ name: 'ecoverseId', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'organisationId', referencedColumnName: 'id' }],
  })
  partners?: Organisation[];

  //
  @Field(() => [Challenge], { nullable: true, description: 'The Challenges hosted by the Ecoverse' })
  @OneToMany(() => Challenge, challenge => challenge.ecoverse, { eager: true, cascade: true })
  challenges?: Challenge[];

  @Field(() => Tagset, { nullable: true, description: 'The set of tags for the ecoverse' })
  @OneToOne(() => Tagset, { eager: true, cascade: true })
  @JoinColumn()
  tagset: Tagset;

  // The restricted group names at the ecoverse level
  restrictedGroupNames?: string[];

  // Create the ecoverse with enough defaults set/ members populated
  constructor() {
    super();
    this.name = '';
    this.context = new Context();
    this.host = new Organisation('Default host');
    this.host.initialiseMembers();
    this.tagset = new Tagset(RestrictedTagsetNames.Default);
    this.tagset.initialiseMembers();
  }

  // Populate an empty ecoverse
  static async populateEmptyEcoverse(ecoverse: Ecoverse): Promise<Ecoverse> {
    // Create new Ecoverse
    ecoverse.initialiseMembers();
    ecoverse.name = 'Empty ecoverse';
    ecoverse.context.tagline = 'An empty ecoverse to be populated';
    ecoverse.host.name = 'Default host organisation';

    // Find the admin user and put that person in as member + admin
    const adminUser = new User('admin');
    adminUser.initialiseMembers();
    const admins = UserGroup.getGroupByName(ecoverse, RestrictedGroupNames.Admins);
    const members = UserGroup.getGroupByName(ecoverse, RestrictedGroupNames.Members);
    admins.addUserToGroup(adminUser);
    members.addUserToGroup(adminUser);

    return ecoverse;
  }

  // Helper method to ensure all members that are arrays are initialised properly.
  // Note: has to be a seprate call due to restrictions from ORM.
  initialiseMembers(): Ecoverse {
    if (!this.restrictedGroupNames) {
      this.restrictedGroupNames = [RestrictedGroupNames.Members, RestrictedGroupNames.Admins];
    }

    if (!this.groups) {
      this.groups = [];
    }

    // Check that the mandatory groups for a challenge are created
    UserGroup.addMandatoryGroups(this, this.restrictedGroupNames);

    if (!this.challenges) {
      this.challenges = [];
    }

    if (!this.partners) {
      this.partners = [];
    }

    return this;
  }
}
