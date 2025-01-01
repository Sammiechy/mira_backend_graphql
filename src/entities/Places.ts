import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Field, InputType, Int, ObjectType } from 'type-graphql';
@ObjectType()
@Entity()
export class Place {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  place_id!: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string;
}

@ObjectType()
export class PlacePrediction {
  @Field()
  description !: string;

  @Field()
  place_id !: string;
}