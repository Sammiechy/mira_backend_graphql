import { Resolver, Query, Mutation, Arg, Ctx, Int } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { CreateShipperResponse, PaginatedShippers, Shipper } from '../entities/Shipper';


@Resolver(Shipper)
export class ShipperResolver {
   private shipperRepository =AppDataSource.getRepository(Shipper);
   @Mutation(() => CreateShipperResponse)
   async createShipper(
    @Arg("Name") Name: string,
    @Arg("LocationID", () => Int, { nullable: true }) LocationID: number,
    @Arg("Phone") Phone: string,
    @Arg("Email") Email: string,
    @Arg("organizationId") organizationId: number
  ): Promise<CreateShipperResponse> {

    const shipperData :any = this.shipperRepository.create({
        Name,
        LocationID,
        Phone,
        Email,
        organizationId,
      });

    const savedShipper :any = await this.shipperRepository.save(shipperData);
      return {
      shipper: savedShipper,
      message: "shipper created successfully",
      }
      }

    @Mutation(() => Boolean)
     async deleteMultipleShipper(
        @Arg('ids', () => [Int]) ids: number[]
        ): Promise<boolean> {
          try {
            if (ids.length === 0) {
              throw new Error('No shipper IDs provided.');
            }
            const result :any = await this.shipperRepository
            .createQueryBuilder()
            .update(Shipper)
            .set({ isDeleted: true })
            .whereInIds(ids)
            .execute();
      
            console.log('Query execution result:', result);
      
            return result.affected > 0;
      
          }catch(error){
            console.error('Error deleting shipper:', error);
            throw new Error('Failed to delete shipper.');
          }
        }
  
           @Query(() =>PaginatedShippers)
           async getShippers(
             @Arg('page', () => Int, { defaultValue: 1 }) page: number,
             @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
           ): Promise<PaginatedShippers> {
             try {
        
              if (page < 1 || limit < 1) {
                throw new Error('Page and limit must be greater than 0');
              }
              
               const skip = (page - 1) * limit;
               const shippers = await this.shipperRepository.find({
                where: { isDeleted: false }, 
                skip,
                take: limit,
              });
        
               const totalCount = await this.shipperRepository.count();
               return { shippers, totalCount };
             } catch (error) {
               console.error('Error fetching shippers:', error);
               throw new Error('Failed to fetch shippers.');
             }
           }
}