import { Resolver, Query, Mutation, Arg, Ctx, Int } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { Place, PlacePrediction } from '../entities/Places';
import { Like } from 'typeorm';

@Resolver(Place)
export class PlaceResolver{
    @Query(() => [PlacePrediction])
    async searchPlaces(@Arg("input") input:string) :Promise<PlacePrediction[]>{
        const cachedPlaces = await AppDataSource.getRepository(Place).find({
            where: { description: Like(`%${input}%`) },
          });


    if (cachedPlaces.length > 0) {
        return cachedPlaces;
      }

      const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
      const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}&types=(regions)`;

      try{
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.status === "OK") {
            const places = data.predictions.map((prediction: any) => ({
              description: prediction.description,
              place_id: prediction.place_id,
            }));
            await AppDataSource.getRepository(Place).save(places);

            return places;
          } else {
            throw new Error(`Google Places API Error: ${data.status}`);
          }

      }catch(err){
        console.error("Error fetching Google Places API:", err);
        throw new Error("Failed to fetch places.");
      }
    }
}
