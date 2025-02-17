import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Field, InputType, Int, ObjectType, registerEnumType,GraphQLISODateTime } from 'type-graphql';
import { Organization } from './Organization';

export enum PaymentMethod {
  PER_HOUR = "per hour",
  PER_MILES = "per miles",
}

registerEnumType(PaymentMethod, {
  name: "PaymentMethod", 
  description: "The available payment methods",
});

@ObjectType()
@Entity()
export class Drivers {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  FirstName!: string;

  @Field()
  @Column()
  LastName!: string;

  @Field()
  @Column({ nullable: true })
  Email!: string;

  @Field({ nullable: true })
  @Column()
  Phone!: string;

  // @Field({ nullable: true })
  // @Column()
  // City!: string;

  // @Field({ nullable: true })
  // @Column()
  // Street!: string;

  // @Field({ nullable: true })
  // @Column()
  // State!: string;

  // @Field({ nullable: true })
  // @Column()
  // ZipCode!: string;

  // @Field({ nullable: true })
  // @Column()
  // Country!: string;

  @Field(() => PaymentMethod)
  @Column({
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.PER_HOUR,
  })
  PaymentMethod!: PaymentMethod;

  @Field(() => Organization)
  @ManyToOne(() => Organization, { eager: true })
  organization!: Organization;

  @Field({ nullable: true })
  @Column()
  Notes!: string;

  @Field({ nullable: true })
  @Column()
  DOB!: string;

  @Field()
  @Column()
  Gender!: string;

  @Field({ nullable: true })
  @Column()
  address!: string;

  @Field({ nullable: true })
  @Column()
  PrimaryCitizenship!: string;

  @Field({ nullable: true })
  @Column()
  Primary_Phone!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  SecondaryCitizenship?: string;

  @Field()
  @Column({ default: false })
  isDeleted!: boolean;
}

@InputType()
export class DriversInput {
  @Field(() => String, { nullable: true })
  message: string | undefined;

  @Field()
  FirstName!: string;

  @Field()
  LastName!: string;

  @Field()
  Email!: string;

  @Field()
  Phone!: string;

  @Field(() => PaymentMethod)
  PaymentMethod!: PaymentMethod;

  @Field()
  @Column()
  Notes!: string;

  @Field({ nullable: true })
  DOB!: string;

  @Field()
  Gender!: string;

  @Field({ nullable: true })
  PrimaryCitizenship!: string;

  @Field({ nullable: true })
  Primary_Phone!: string;

  @Field({ nullable: true })
  SecondaryCitizenship?: string;

  @Field({ nullable: true })
  address!: string;

  // @Field({ nullable: true })
  // Street!: string;

  // @Field({ nullable: true })
  // City!: string;

  // @Field({ nullable: true })
  // State!: string;

  // @Field({ nullable: true })
  // ZipCode!: string;

  // @Field({ nullable: true })
  // Country!: string;

  @Field()
  @Column()
  organizationId!: number;
}

@ObjectType()
export class EditDriverResponse {
  @Field(() => String)
  message: string | undefined;

  @Field(() => Boolean, { defaultValue: true })
  success: boolean | undefined;

  @Field(() => Drivers, { nullable: true })
  drivers?: Drivers;
}

@ObjectType()
export class PaginatedDrivers {
  @Field(() => [Drivers])
  drivers: Drivers[] | undefined;

  @Field(() => Int)
  totalCount: number | undefined;
}

@ObjectType()
export class CreateDriversResponse {
  @Field(() => Drivers, { nullable: true })
  drivers!: Drivers;

  @Field()
  message!: string;
}