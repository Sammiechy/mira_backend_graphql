import { Resolver, Query, Mutation, Arg, Ctx, Int } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { LoadInput, Loads } from '../entities/Loads';
import { Shipper } from '../entities/Shipper';
import { Reciever } from '../entities/Reciever';
import { Drivers } from '../entities/Drivers';
import { Equipment } from '../entities/Equipment';
import { Organization } from '../entities/Organization';

@Resolver(Loads)
export class LoadsResolver {
    private loadRepository = AppDataSource.getRepository(Loads);

    @Query(() => [Loads])
    async getAllLoads(): Promise<Loads[]> {
        return await this.loadRepository.find({relations: ["shipper", "reciever", "drivers", "equipment", "organization"]});
    }

    @Mutation(() => Loads)
    async addLoad(@Arg("data") data: LoadInput): Promise<Loads> {
        const shipper = await AppDataSource.getRepository(Shipper).findOne({ where: { id: data.shipper_id } });
        const reciever = await AppDataSource.getRepository(Reciever).findOne({ where: { id: data.reciever_id } });
        const driver = await AppDataSource.getRepository(Drivers).findOne({ where: { id: data.driver_id } });
        const equipment = await AppDataSource.getRepository(Equipment).findOne({ where: { id: data.equipment_id } });
        const organization = await AppDataSource.getRepository(Organization).findOne({ where: { id: data.organizationId } });

        if (!shipper || !reciever || !driver || !equipment || !organization) {
            throw new Error("Invalid IDs provided for related entities.");
        }
    
        const load = this.loadRepository.create({
            shipper, 
            reciever,
            drivers: driver,
            equipment,
            organization,
            origin_location_id: data.origin_location_id,
            destination_location_id: data.destination_location_id,
            type: data.type,
            weight: data.weight,
            description: data.description,
            notes: data.notes,
            status: data.status,
            loading_date: data.loading_date,
            delivery_date: data.delivery_date,
        });
    
        await this.loadRepository.save(load);
        return load;
    }
    
}