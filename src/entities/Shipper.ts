import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Shipper {
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
    Phone!: string;

    @Field()
    @Column()
    Email!: string;

    @Field()
    @Column()
    organizationId!: number;

//   @OneToMany(() => User, (user) => user.organizationId)
//     users!: User[];

  @Field()
    @Column({ default: false })
    isDeleted!: boolean;
}

@ObjectType()
export class PaginatedShippers {
  @Field(() => [Shipper])
  shippers: Shipper[] | undefined;

  @Field(() => Int)
  totalCount: number | undefined;
}

@ObjectType()
export class CreateShipperResponse {
  @Field(() => Shipper, { nullable: true })
  shipper!: Shipper;

  @Field()
  message!: string;
}