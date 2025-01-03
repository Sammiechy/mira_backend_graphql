import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Field, InputType, Int, ObjectType } from 'type-graphql';
import { Organization } from './Organization';

@ObjectType()
@Entity()
export class Equipment {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  Type!: string;

  @Field()
  @Column()
  Description!: string;

  @Field(() => Organization)
  @ManyToOne(() => Organization, { eager: true })
  organization!: Organization;

  @Field()
  @Column({ default: false })
  isDeleted!: boolean;
}

@InputType()
export class EquipmentInput {
  @Field(() => String, { nullable: true })
  message: string | undefined;

  @Field()
  Type!: string;

  @Field()
  @Column()
  Description!: string;

  @Field()
  @Column()
  organizationId!: number;
}

@ObjectType()
export class EditEquipmentResponse {
  @Field(() => String)
  message: string | undefined;

  @Field(() => Boolean, { defaultValue: true })
  success: boolean | undefined;

  @Field(() => Equipment, { nullable: true })
  equipment?: Equipment;
}

@ObjectType()
export class PaginatedEquipment {
  @Field(() => [Equipment])
  equipment: Equipment[] | undefined;

  @Field(() => Int)
  totalCount: number | undefined;
}

@ObjectType()
export class CreateEquipmentResponse {
  @Field(() => Equipment, { nullable: true })
  equipment!: Equipment;

  @Field()
  message!: string;
}