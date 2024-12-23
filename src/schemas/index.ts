import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/UserResolver";
import { OrganizationResolver } from "../resolvers/OrganizationResolver";
import { ShipperResolver } from "../resolvers/ShipperResolver";

export const createSchema = () => {
  return buildSchema({
    resolvers: [UserResolver, OrganizationResolver,ShipperResolver],
    validate: false,
  });
};
