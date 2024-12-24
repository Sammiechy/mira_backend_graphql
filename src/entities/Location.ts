import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()

export class Location{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number; 

    @Field()
    @Column({ length: 255 })
    Address1: string | undefined;

    @Field({ nullable: true })
    @Column({ length: 255, nullable: true })
    Address2?: string;

    @Field()
    @Column({ length: 100 })
    City: string | undefined;

    @Field()
    @Column({ length: 100 })
    State_Province: string | undefined;

    @Field()
    @Column({ length: 100 })
    PostalCode_Zip: string | undefined;

    @Field()
    @Column({ length: 100 })
    Country: string | undefined;
}