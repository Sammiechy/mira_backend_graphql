import { gql } from "apollo-server-express";

export const typeDefs = gql`
type User {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  phone: String!
  role: String!
  status: String!
  type: String!
  organizationId: Int!
}

type SignUpResponse {
  message: String!
  userId: ID!
}

type Query {
  users: [User!]!
}

type Mutation {
  signUp(
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    role: String!
    password: String!
    status: String!
    type: String!
    organizationId: Int!
  ): SignUpResponse!
}
`;
