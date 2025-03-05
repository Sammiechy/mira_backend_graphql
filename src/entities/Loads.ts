import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Field, InputType, Int, ObjectType } from 'type-graphql';
import { Organization } from './Organization';
import { Shipper } from './Shipper';
import { Reciever } from './Reciever';
import { Drivers } from './Drivers';
import { Equipment } from './Equipment';

@ObjectType()
@Entity()
export class Loads {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Shipper,  { nullable: true })
    @ManyToOne(() => Shipper, { eager: true })
    shipper!: Shipper;

    @Field(() => Reciever, { nullable: true })
    @ManyToOne(() => Reciever, { eager: true })
    reciever!: Reciever;

    @Field(() => Drivers, { nullable: true })
    @ManyToOne(() => Drivers, { eager: true })
    drivers!: Drivers;
 
    @Field(() => Equipment, { nullable: true })
    @ManyToOne(() => Equipment,  { eager: true })
    equipment!: Equipment;

    // @Field()
    // origin_location_id!: number;

    @Field()
    @Column()
    origin_location_id!: string;  

    // @Field()
    // destination_location_id!: number;

    @Field()
    @Column()
    destination_location_id!: string;

    @Field()
    @Column()
    type!: string;

    @Field()
    @Column()
    weight!: string;

    @Field()
    @Column()
    description!: string;

    @Field()
    @Column()
    notes!: string;

    // @Field()
    // organizationId!: string;

    @Field(() => Organization, { nullable: true })  
    @ManyToOne(() => Organization, { eager: true, nullable: true })
    organization?: Organization;
    

    @Field()
    @Column()
    status!: string;

    @Field()
    @Column()
    loading_date!: string;

    @Field()
    @Column()
    delivery_date!: string;

}
@InputType()
@InputType()
export class LoadInput {
    @Field({ nullable: true })
    shipper_id?: number;

    @Field({ nullable: true })
    reciever_id?: number;

    @Field({ nullable: true })
    driver_id?: number;

    @Field({ nullable: true })
    equipment_id?: number;

    @Field({ nullable: true })
    organizationId?: number;

    @Field()
    origin_location_id!: string;

    @Field()
    destination_location_id!: string;

    @Field()
    type!: string;

    @Field()
    weight!: string;

    @Field()
    description!: string;

    @Field()
    notes!: string;

    @Field()
    status!: string;

    @Field()
    loading_date!: string;

    @Field()
    delivery_date!: string;
}

