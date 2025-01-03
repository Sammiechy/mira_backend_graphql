import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Field, InputType, Int, ObjectType } from 'type-graphql';
import { Organization } from './Organization';

@ObjectType()
@Entity()
export class Shipper {
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

    @Field({ nullable: true })
    @Column()
    address!: string;

    @Field()
    @Column()
    Email!: string;

    @Field()
    @Column()
    organizationId!: number;

    @Field(() => Organization) 
    @ManyToOne(() => Organization, { eager: true }) 
    organization!: Organization;

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