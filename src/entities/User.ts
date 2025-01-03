import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Organization } from './Organization';

@ObjectType()
@Entity()
export class User {
  static create(arg0: { firstName: string; lastName: string; email: string; phone: string; role: string; password: string; status: string; type: string; organizationId: number; }) {
    throw new Error('Method not implemented.');
  }
  static find(): User[] | PromiseLike<User[]> {
    throw new Error('Method not implemented.');
  }
  // static create(p0: { email: any; password: string; }) {
  //     throw new Error("Method not implemented.");
  // }
  // static findOne(arg0: { where: { email: any; }; }) {
  //     throw new Error("Method not implemented.");
  // }
  @Field()
    @PrimaryGeneratedColumn()
    id!: number;

  @Field()
    @Column()
    firstName!: string;

  @Field()
    @Column()
    lastName!: string;

  @Field()
    @Column({ unique: true })
    email!: string;

  @Field()
    @Column()
    phone!: string;

  @Field()
    @Column()
    role!: string;

    @Field()
    @Column()
    type!: string;

    @Field()
    @Column()
    status!: string;

    @Field(() => Organization) 
    @ManyToOne(() => Organization, { eager: true }) 
    organization!: Organization;

    @Field()
    @Column({ nullable: true })
    organizationId!: number;

  // @ManyToOne(() => Organization, (organization) => organization.users)
  //   @JoinColumn({ name: 'organizationId' })
  //   organization!: Organization;

  @Field(() => String) // Optionally expose this if needed for GraphQL
@Column()
password!: string;

// @Field()
// @Column({ default: false })
// isDeleted!: boolean;

  // @Field()
  //   @Column({ default: false })
  //   isDeleted!: boolean;
  // password: string | undefined;

}

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  users: User[] | undefined;

  @Field(() => Int)
  totalCount: number | undefined;
}

@ObjectType()
export class SignUpResponse {
  @Field(() => String)
  message: string | undefined;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => String, { nullable: true })
  email?: string; // Add user's email in the response

  @Field(() => String, { nullable: true })
  role?: string; // Add user's role in the response
}

@ObjectType()
export class SignInResponse {
  @Field(() => String)
  token!: string;

  @Field(() => User)
  user!: User;
}

@ObjectType()
export class SignOutResponse {
  @Field(() => String)
  message!: string;

  @Field(() => Boolean)
  success!: boolean;
}
