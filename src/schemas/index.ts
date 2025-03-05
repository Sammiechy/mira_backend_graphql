import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/UserResolver";
import { OrganizationResolver } from "../resolvers/OrganizationResolver";
import { ShipperResolver } from "../resolvers/ShipperResolver";
import { RecieverResolver } from "../resolvers/RecieverResolver";
import { PlaceResolver } from "../resolvers/PlacesResolver";
import { LocationResolver } from "../resolvers/LocationResolver";
import { EquipmentResolver } from "../resolvers/EquipmentResolvers";
import { DriversResolver } from "../resolvers/DriversResolvers";
import { LoadsResolver } from "../resolvers/LoadsResolvers";
export const createSchema = () => {
  // const ShipperResolvers=[ShipperContactResolver]?.flat()

  return buildSchema({
    resolvers: [UserResolver, OrganizationResolver,ShipperResolver, RecieverResolver,PlaceResolver,LocationResolver,EquipmentResolver,DriversResolver,LoadsResolver],
    validate: false,
  });
};
