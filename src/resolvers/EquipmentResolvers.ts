import { Resolver, Query, Mutation, Arg, Ctx, Int } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { Organization } from '../entities/Organization';
import { CreateEquipmentResponse, EditEquipmentResponse, Equipment, EquipmentInput, PaginatedEquipment } from '../entities/Equipment';


@Resolver(Equipment)
export class EquipmentResolver {
  private equipmentRepository = AppDataSource.getRepository(Equipment);
  @Mutation(() => CreateEquipmentResponse)
  async createEquipment(
    @Arg("Type") Type: string,
    @Arg("Description") Description: string,
    @Arg("organizationId") organizationId: number
  ): Promise<CreateEquipmentResponse> {

    const equipmentData: any = this.equipmentRepository.create({
      Type,
      Description,
      organization: { id: organizationId }
    });

    const savedEquipment: any = await this.equipmentRepository.save(equipmentData);
    return {
      equipment: savedEquipment,
      message: "equipment created successfully",
    }
  }

  @Query(() => Equipment, { nullable: true })
  async getEquipmentById(
    @Arg('id', () => Int) id: number
  ): Promise<Equipment | null> {
    try {
      const equipment = await this.equipmentRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['organization'],
      });

      if (!equipment) {
        throw new Error('Organization not found.');
      }

      return equipment;
    } catch (error) {
      console.error('Error fetching equipment by ID:', error);
      throw new Error('Failed to fetch equipment by ID.');
    }
  }

  @Mutation(() => Boolean)
  async deleteMultipleEquipment(
    @Arg('ids', () => [Int]) ids: number[]
  ): Promise<boolean> {
    try {
      if (ids.length === 0) {
        throw new Error('No equipment IDs provided.');
      }
      const result: any = await this.equipmentRepository
        .createQueryBuilder()
        .update(Equipment)
        .set({ isDeleted: true })
        .whereInIds(ids)
        .execute();

      console.log('Query execution result:', result);

      return result.affected > 0;

    } catch (error) {
      console.error('Error deleting equipment:', error);
      throw new Error('Failed to delete equipment.');
    }
  }

  @Mutation(() => EditEquipmentResponse)
  async editEquipment(
    @Arg('id', () => Int) id: number,
    @Arg('data', () => EquipmentInput) data: Partial<EquipmentInput>
  ): Promise<EditEquipmentResponse> {

    try {
      // Find the organization by ID
      const equipment = await this.equipmentRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['organization'],
      });

      if (!equipment) {
        throw new Error('Organization not found.');
      }

      if (data.organizationId) {
        const organization = await AppDataSource.getRepository(Organization).findOne({
          where: { id: data.organizationId },
        });

        if (!organization) {
          throw new Error('Organization not found.');
        }
        equipment.organization = organization;
      }

      Object.assign(equipment, {
        Type: data.Type ?? equipment.Type,
        Description: data.Description ?? equipment.Description,
      })

      await this.equipmentRepository.save(equipment);

      return {
        message: 'Equipment updated successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw new Error('Failed to update equipment.');
    }

  }

  @Query(() => PaginatedEquipment)
  async getEquipment(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
  ): Promise<PaginatedEquipment> {
    try {

      if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be greater than 0');
      }

      const skip = (page - 1) * limit;
      const equipment = await this.equipmentRepository.find({
        where: { isDeleted: false },
        skip,
        take: limit,
        relations: ['organization'],
      });

      const totalCount = await this.equipmentRepository.count();
      return { equipment, totalCount };
    } catch (error) {
      console.error('Error fetching equipment:', error);
      throw new Error('Failed to fetch equipment.');
    }
  }
}