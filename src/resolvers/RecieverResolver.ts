import { Resolver, Query, Mutation, Arg, Ctx, Int } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { CreateRecieversResponse, EditRecieverResponse, PaginatedRecievers, Reciever, RecieverInput } from '../entities/Reciever';


@Resolver(Reciever)
export class RecieverResolver {
   private recieverRepository =AppDataSource.getRepository(Reciever);
   @Mutation(() => CreateRecieversResponse)
   async createReciever(
    @Arg("Name") Name: string,
    @Arg("LocationID") LocationID: string,
    @Arg("Phone") Phone: string,
    @Arg("Email") Email: string,
    @Arg("address") address:string,
    @Arg("organizationId") organizationId: number
  ): Promise<CreateRecieversResponse> {

    const recieverData :any = this.recieverRepository.create({
        Name,
        LocationID,
        Phone,
        Email,
        address,
        organizationId,
      });

    const savedShipper :any = await this.recieverRepository.save(recieverData);
      return {
      reciever: savedShipper,
      message: "reciever created successfully",
      }
      }

         @Query(() => Reciever, { nullable: true })
         async getRecieverById(
           @Arg('id', () => Int) id: number
         ): Promise<Reciever | null> {
           try {
             const reciever = await this.recieverRepository.findOne({
               where: { id, isDeleted: false }, // Ensure it hasn't been soft-deleted
             });
       
             if (!reciever) {
               throw new Error('Reciever not found.');
             }
       
             return reciever;
           } catch (error) {
             console.error('Error fetching reciever by ID:', error);
             throw new Error('Failed to fetch reciever by ID.');
           }
         }

    @Mutation(() => Boolean)
     async deleteMultipleReciever(
        @Arg('ids', () => [Int]) ids: number[]
        ): Promise<boolean> {
          try {
            if (ids.length === 0) {
              throw new Error('No reciever IDs provided.');
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
            console.error('Error deleting reciever:', error);
            throw new Error('Failed to delete reciever.');
          }
        }

         @Mutation(() => EditRecieverResponse)
     async editReciever(
       @Arg('id', () => Int) id: number,
       @Arg('data', () => RecieverInput) data: Partial<RecieverInput>
     ): Promise<EditRecieverResponse> {
      
      try {
        // Find the organization by ID
        const reciever = await this.recieverRepository.findOne({
          where: { id, isDeleted: false },
        });
    
        if (!reciever) {
          throw new Error('Reciever not found.');
        }
    
        // Update the organization with new data
        Object.assign(reciever, data);
    
        // Save the updated organization
        await this.recieverRepository.save(reciever);
    
        return {
          message: 'Reciever updated successfully',
          success: true,
        };
      } catch (error) {
        console.error('Error updating reciever:', error);
        throw new Error('Failed to update reciever.');
      }

     }
  
           @Query(() =>PaginatedRecievers)
           async getRecievers(
             @Arg('page', () => Int, { defaultValue: 1 }) page: number,
             @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
           ): Promise<PaginatedRecievers> {
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