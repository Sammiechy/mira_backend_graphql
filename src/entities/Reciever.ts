import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Reciever {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

    @Field()
    @Column()
    Name!: string;

    @Field()
    @Column()
    LocationID!: string;

    @Field()
    @Column()
    Phone!: string;

    @Field()
    @Column()
    Email!: string;

    @Field({ nullable: true })
    @Column()
    address!: string;

    @Field()
    @Column()
    organizationId!: number;

//   @OneToMany(() => User, (user) => user.organizationId)
//     users!: User[];

  @Field()
    @Column({ default: false })
    isDeleted!: boolean;
}

@InputType()
export class RecieverInput {
  @Field(() => String,{ nullable: true })
  message: string | undefined;

  @Field()
  Name!: string;

  @Field()
  @Column()
  LocationID!: string;

  @Field()
  @Column()
  organizationId!: number;

  @Field({ nullable: true })
  @Column()
  address!: string;

  @Field()
  Phone!: string;

  @Field()
  Email!: string;
}

@ObjectType()
export class EditRecieverResponse {
  @Field(() => String)
  message: string | undefined;

  @Field(() => Boolean, { defaultValue: true })
  success: boolean | undefined;

  @Field(() => Reciever, { nullable: true })
  reciever?: Reciever;
}

@ObjectType()
export class PaginatedRecievers {
  @Field(() => [Reciever])
  recievers: Reciever[] | undefined;

  @Field(() => Int)
  totalCount: number | undefined;
}

@ObjectType()
export class CreateRecieversResponse {
  @Field(() => Reciever, { nullable: true })
  reciever!: Reciever;

  @Field()
  message!: string;
}