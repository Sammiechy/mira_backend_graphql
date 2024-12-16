import { AddOrganizationResponse, Organization, OrganizationInput } from '../entities/Organization';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
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

    }
