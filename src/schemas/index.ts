import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/UserResolver";
import { OrganizationResolver } from "../resolvers/OrganizationResolver";
import { ShipperResolver } from "../resolvers/ShipperResolver";
import { RecieverResolver } from "../resolvers/RecieverResolver";

export const createSchema = () => {
  return buildSchema({
    resolvers: [UserResolver, OrganizationResolver,ShipperResolver, RecieverResolver],
    validate: false,
  });
};
