import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Location {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  Address1!: string; 

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true }) 
  Address2?: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  City!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  State_Province!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  PostalCode_Zip!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  Country!: string;
}
