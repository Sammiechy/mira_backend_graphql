import { Resolver, Query, Mutation, Arg, Ctx, Int } from 'type-graphql';
import { AppDataSource } from '../data-source';
import {CreateLocationResponse, Location} from '../entities/Location';

@Resolver(Location)
export class LocationResolver{
     private recieverRepository =AppDataSource.getRepository(Location);
       @Mutation(() => CreateLocationResponse)
        async createLocation(
         @Arg("Address1") Address1: string,
         @Arg("places_id") places_id: string,
         @Arg("Address2") Address2: string,
         @Arg("City") City: string,
         @Arg("PostalCode_Zip") PostalCode_Zip: string,
         @Arg("Country") Country: string,
         @Arg("State_Province") State_Province: string
       ): Promise<CreateLocationResponse> {
     
         const locationData :any = this.recieverRepository.create({
            Address1,
            places_id,
            Address2,
            City,
            PostalCode_Zip,
            Country,
            State_Province
           });
     
         const savedLocation :any = await this.recieverRepository.save(locationData);
           return {
            location: savedLocation,
           message: "location created successfully",
           }
           }

}