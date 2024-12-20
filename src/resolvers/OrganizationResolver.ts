import { AddOrganizationResponse, EditOrganizationResponse, Organization, OrganizationInput, PaginatedOrganizations } from '../entities/Organization';
import { Resolver, Query, Mutation, Arg, Ctx, Int } from 'type-graphql';
import { AppDataSource } from '../data-source';

// const userRepository = AppDataSource.getRepository(Organization);

@Resolver(Organization)
export class OrganizationResolver{
private organizationRepository =AppDataSource.getRepository(Organization);
@Mutation(() => AddOrganizationResponse)
async addOrganization(
@Arg('data') data: OrganizationInput
): Promise<Organization>{
try{
    const organization: any = this.organizationRepository.create(data);
    await this.organizationRepository.save(organization);
    return {
        message: 'Organization created successfully',
        organization,
      };
    }catch(error){
    console.error('Error creating organization:', error);
    throw new Error('Failed to create organization.');
    }
   }

   @Mutation(() => Boolean)
   async deleteMultipleOrganizations(
    @Arg('ids', () => [Int]) ids: number[]
  ): Promise<boolean> {
    try {
      if (ids.length === 0) {
        throw new Error('No organization IDs provided.');
      }
      const result :any = await this.organizationRepository
      .createQueryBuilder()
      .update(Organization)
      .set({ isDeleted: true })
      .whereInIds(ids)
      .execute();

      console.log('Query execution result:', result);

      return result.affected > 0;

    }catch(error){
      console.error('Error deleting organizations:', error);
      throw new Error('Failed to delete organizations.');
    }
  }

   @Query(() =>PaginatedOrganizations)
   async getOrganizations(
     @Arg('page', () => Int, { defaultValue: 1 }) page: number,
     @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
   ): Promise<PaginatedOrganizations> {
     try {

      if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be greater than 0');
      }
      
       const skip = (page - 1) * limit; // Calculate the offset
       const organizations = await this.organizationRepository.find({
        where: { isDeleted: false }, // Fetch only active organizations
        skip,
        take: limit,
      });

       const totalCount = await this.organizationRepository.count();
       return { organizations, totalCount };
     } catch (error) {
       console.error('Error fetching organizations:', error);
       throw new Error('Failed to fetch organizations.');
     }
   }

   @Query(() => Organization, { nullable: true })
   async getOrganizationById(
     @Arg('id', () => Int) id: number
   ): Promise<Organization | null> {
     try {
       const organization = await this.organizationRepository.findOne({
         where: { id, isDeleted: false }, // Ensure it hasn't been soft-deleted
       });
 
       if (!organization) {
         throw new Error('Organization not found.');
       }
 
       return organization;
     } catch (error) {
       console.error('Error fetching organization by ID:', error);
       throw new Error('Failed to fetch organization by ID.');
     }
   }

   @Mutation(() => EditOrganizationResponse)
async editOrganization(
  @Arg('id', () => Int) id: number,
  @Arg('data', () => OrganizationInput) data: Partial<OrganizationInput>
): Promise<AddOrganizationResponse> {
  try {
    // Find the organization by ID
    const organization = await this.organizationRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!organization) {
      throw new Error('Organization not found.');
    }

    // Update the organization with new data
    Object.assign(organization, data);

    // Save the updated organization
    await this.organizationRepository.save(organization);

    return {
      message: 'Organization updated successfully',
      success: true,
    };
  } catch (error) {
    console.error('Error updating organization:', error);
    throw new Error('Failed to update organization.');
  }
}

    }
