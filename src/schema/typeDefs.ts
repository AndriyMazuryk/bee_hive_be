import { gql, ITypeDefinitions } from "apollo-server-express";

export const typeDefs: ITypeDefinitions = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Query {
    getAllUsers: [User!]!
    me: User
  }

  type Mutation {
    register(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): Boolean!
    login(email: String!, password: String!): User
    logout: Boolean!
    invalidateTokens: Boolean!
  }
`;
