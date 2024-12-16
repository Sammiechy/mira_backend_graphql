import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Field, InputType, Int, ObjectType } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity()
export class Organization {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
    @Column()
    Name!: string;

    @Field(() => Number,{ nullable: true })
    @Column({ default: 0 })
    LocationID!: number;
  
    @Field()
    @Column()
    Website!: string;

    @Field()
    @Column()
    Phone!: string;

    @Field()
    @Column()
    Email!: string;

  @OneToMany(() => User, (user) => user.organizationId)
    users!: User[];

  @Field()
    @Column({ default: false })
    isDeleted!: boolean;
}

@InputType()
export class OrganizationInput {
  @Field(() => String,{ nullable: true })
  message: string | undefined;

  @Field()
  Name!: string;

  @Field(() => Number,{ nullable: true })
  @Column({ default: 0 })
  LocationID!: number;

  @Field()
  Website!: string;

  @Field()
  Phone!: string;

  @Field()
  Email!: string;
}

@ObjectType()
export class AddOrganizationResponse {
  @Field(() => String,{ nullable: true })
  message: string | undefined;

  @Field(() => Organization, { nullable: true })
  organization: Organization | undefined;
}

@ObjectType()
export class PaginatedOrganizations {
  @Field(() => [Organization])
  organizations: Organization[] | undefined;

  @Field(() => Int)
  totalCount: number | undefined;
}