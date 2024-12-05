import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class BlacklistedToken {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id!: number;

  @Column()
  @Field(() => String)
  token!: string;

  @Column()
  @Field(() => Date)
  expiresAt!: Date;
}
