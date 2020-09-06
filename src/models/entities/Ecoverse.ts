import { Field, ID, ObjectType, Float } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Challenge, Context, DID, Organisation, Tag, User, UserGroup } from '.';


@Entity()
@ObjectType()
export class Ecoverse extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    // The context and host organisation
    @Field(() => String, { nullable: false, description: '' })
    @Column()
    name: string;

    @Field(() => Organisation, { nullable: true, description: 'The organisation that hosts this Ecoverse instance' })
    @OneToOne(() => Organisation, { eager: true, cascade: true })
    @JoinColumn()
    ecoverseHost?: Organisation;

    @Field(() => Context, { nullable: true, description: 'The shared understanding for the Ecoverse' })
    @OneToOne(() => Context, { eager: true, cascade: true })
    @JoinColumn()
    context?: Context;

    // The digital identity for the Ecoverse - critical for its trusted role
    @OneToOne(() => DID, { eager: true, cascade: true })
    @JoinColumn()
    DID!: DID;

    @Field(() => [User], { nullable: true, description: 'The community for the ecoverse' })
    members?: User[];

    @Field(() => [UserGroup], { nullable: true })
    @OneToMany(
        () => UserGroup,
        userGroup => userGroup.ecoverse,
        { eager: true, cascade: true },
    )
    groups?: UserGroup[];

    @Field(() => [Organisation], { nullable: true, description: 'The set of partner organisations associated with this Ecoverse' })
    @OneToMany(
        () => Organisation,
        organisation => organisation.ecoverse,
        { eager: true, cascade: true },
    )
    partners?: Organisation[];

    //
    @Field(() => [Challenge], { nullable: true, description: 'The Challenges hosted by the Ecoverse' })
    @OneToMany(
        () => Challenge,
        challenge => challenge.ecoverse,
        { eager: true, cascade: true },
    )
    challenges?: Challenge[];

    @Field(() => [Tag], { nullable: true, description: 'Set of restricted tags that are used within this ecoverse' })
    @ManyToMany(
        () => Tag,
        tag => tag.ecoverses,
        { eager: true, cascade: true })
    @JoinTable()
    tags?: Tag[];

    // Functional methods for managing the Ecoverse
    constructor(name: string) {
        super();
        this.name = name;
    }

    private static instance: Ecoverse;

    static async getInstance() : Promise<Ecoverse>
    {
        const ecoverseCount = await Ecoverse.count();
        if(ecoverseCount < 1)
        {
            Ecoverse.instance = new Ecoverse('Empty Ecoverse');
            await Ecoverse.instance.save();
        }
        else    
        {
            Ecoverse.instance = await Ecoverse.findOneOrFail();
        }
        
        if(ecoverseCount > 1)
            throw new Error('Ecoverse count can not be more than one!');


        return Ecoverse.instance;
    }

}