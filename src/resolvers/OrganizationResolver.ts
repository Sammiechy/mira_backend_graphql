import { AddOrganizationResponse, Organization, OrganizationInput, PaginatedOrganizations } from '../entities/Organization';
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

    }
