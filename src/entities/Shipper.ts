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

@InputType()
export class ShipperInput {
  @Field(() => String,{ nullable: true })
  message: string | undefined;

  @Field()
  Name!: string;

  @Field(() => Number,{ nullable: true })
  @Column({ default: 0 })
  LocationID!: number;

  @Field()
  @Column()
  organizationId!: number;

  @Field()
  Phone!: string;

  @Field()
  Email!: string;
}

@ObjectType()
export class EditShipperResponse {
  @Field(() => String)
  message: string | undefined;

  @Field(() => Boolean, { defaultValue: true })
  success: boolean | undefined;

  @Field(() => Shipper, { nullable: true })
  shipper?: Shipper;
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