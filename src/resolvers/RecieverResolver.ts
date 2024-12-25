import { Resolver, Query, Mutation, Arg, Ctx, Int } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { CreateRecieverResponse, PaginatedReciever, Reciever } from '../entities/Reciever';



@Resolver(Reciever)
export class ShipperResolver {
   private recieverRepository =AppDataSource.getRepository(Reciever);
   @Mutation(() => CreateRecieverResponse)
   async createShipper(
    @Arg("Name") Name: string,
    @Arg("LocationID", () => Int, { nullable: true }) LocationID: number,
    @Arg("Phone") Phone: string,
    @Arg("Email") Email: string,
    @Arg("organizationId") organizationId: number
  ): Promise<CreateRecieverResponse> {

    const recieverData :any = this.recieverRepository.create({
        Name,
        LocationID,
        Phone,
        Email,
        organizationId,
      });

    const savedReciever :any = await this.recieverRepository.save(recieverData);
      return {
        recievers: savedReciever,
        message: "reciever created successfully",
      }
      }

    @Mutation(() => Boolean)
     async deleteMultipleReciever(
        @Arg('ids', () => [Int]) ids: number[]
        ): Promise<boolean> {
          try {
            if (ids.length === 0) {
              throw new Error('No shipper IDs provided.');
            }
            const result :any = await this.recieverRepository
            .createQueryBuilder()
            .update(Reciever)
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
  
           @Query(() =>PaginatedReciever)
           async getShippers(
             @Arg('page', () => Int, { defaultValue: 1 }) page: number,
             @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
           ): Promise<PaginatedReciever> {
             try {
        
              if (page < 1 || limit < 1) {
                throw new Error('Page and limit must be greater than 0');
              }
              
               const skip = (page - 1) * limit;
               const recievers = await this.recieverRepository.find({
                where: { isDeleted: false }, 
                skip,
                take: limit,
              });
        
               const totalCount = await this.recieverRepository.count();
               return { recievers, totalCount };
             } catch (error) {
               console.error('Error fetching recievers:', error);
               throw new Error('Failed to fetch recievers.');
             }
           }
}