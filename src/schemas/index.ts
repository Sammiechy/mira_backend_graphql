import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/UserResolver";
import { OrganizationResolver } from "../resolvers/OrganizationResolver";

export const createSchema = () => {
  return buildSchema({
    resolvers: [UserResolver, OrganizationResolver],
    validate: false,
  });
};
