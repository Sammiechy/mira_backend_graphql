import { Resolver, Query, Mutation, Arg, Ctx, Int } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { Organization } from '../entities/Organization';
import { CreateDriversResponse, Drivers, DriversInput, EditDriverResponse, PaginatedDrivers, PaymentMethod } from '../entities/Drivers';


@Resolver(Drivers)
export class DriversResolver {
  private driversRepository = AppDataSource.getRepository(Drivers);
  @Mutation(() => CreateDriversResponse)
  async createDrivers(
    @Arg("FirstName") FirstName: string,
    @Arg("LastName") LastName: string,
    @Arg("Email") Email: string,
    @Arg("Phone") Phone: string,
    @Arg("PaymentMethod", () => PaymentMethod) PaymentMethod: PaymentMethod,
    @Arg("Notes") Notes: string,
    @Arg("organizationId") organizationId: number
  ): Promise<CreateDriversResponse> {

    
    const driversData: any = this.driversRepository.create({
      FirstName,
      LastName,
      Email,
      Phone,
      PaymentMethod,
      Notes,
      organization: { id: organizationId }
    });

    const savedDrivers: any = await this.driversRepository.save(driversData);
    return {
      drivers: savedDrivers,
      message: "driver created successfully",
    }
  }

  @Query(() => Drivers, { nullable: true })
  async getDriversById(
    @Arg('id', () => Int) id: number
  ): Promise<Drivers | null> {
    try {
      const drivers = await this.driversRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['organization'],
      });

      if (!drivers) {
        throw new Error('Organization not found.');
      }

      return drivers;
    } catch (error) {
      console.error('Error fetching driver by ID:', error);
      throw new Error('Failed to fetch driver by ID.');
    }
  }

  @Mutation(() => Boolean)
  async deleteMultipleDrivers(
    @Arg('ids', () => [Int]) ids: number[]
  ): Promise<boolean> {
    try {
      if (ids.length === 0) {
        throw new Error('No driver IDs provided.');
      }
      const result: any = await this.driversRepository
        .createQueryBuilder()
        .update(Drivers)
        .set({ isDeleted: true })
        .whereInIds(ids)
        .execute();

      console.log('Query execution result:', result);

      return result.affected > 0;

    } catch (error) {
      console.error('Error deleting driver:', error);
      throw new Error('Failed to delete driver.');
    }
  }

  @Mutation(() => EditDriverResponse)
  async editDrivers(
    @Arg('id', () => Int) id: number,
    @Arg('data', () => DriversInput) data: Partial<DriversInput>
  ): Promise<EditDriverResponse> {

    try {
      // Find the organization by ID
      const drivers = await this.driversRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['organization'],
      });

      if (!drivers) {
        throw new Error('Organization not found.');
      }

      if (data.organizationId) {
        const organization = await AppDataSource.getRepository(Organization).findOne({
          where: { id: data.organizationId },
        });

        if (!organization) {
          throw new Error('Organization not found.');
        }
        drivers.organization = organization;
      }

      Object.assign(drivers, {
        FirstName: data.FirstName ?? drivers.FirstName,
        LastName: data.LastName ?? drivers.LastName,
        Email: data.Email ?? drivers.Email,
        Phone: data.Phone ?? drivers.Phone,
        PaymentMethod: data.PaymentMethod ?? drivers.PaymentMethod,
        Notes: data.Notes ?? drivers.Notes,
      })

      await this.driversRepository.save(drivers);
      return {
        message: 'Driver updated successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error updating driver:', error);
      throw new Error('Failed to update driver.');
    }

  }

  @Query(() => PaginatedDrivers)
  async getDrivers(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
  ): Promise<PaginatedDrivers> {
    try {

      if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be greater than 0');
      }

      const skip = (page - 1) * limit;
      const drivers = await this.driversRepository.find({
        where: { isDeleted: false },
        skip,
        take: limit,
        relations: ['organization'],
      });

      const totalCount = await this.driversRepository.count();
      return { drivers, totalCount };
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw new Error('Failed to fetch drivers.');
    }
  }
}