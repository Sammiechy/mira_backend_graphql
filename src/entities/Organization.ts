// src/entities/Organization.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity()
export class Organization {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
    @Column()
    name!: string;

  @Field()
    @Column()
    address!: string;

  @OneToMany(() => User, (user) => user.organizationId)
    users!: User[];

  @Field()
    @Column({ default: false })
    isDeleted!: boolean;
}
