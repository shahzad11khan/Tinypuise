const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    users: [User]
    getUser(id: ID!): User
  }

  type Mutation {
    register(imageFile: String, name: String, email: String, password: String, confirmPassword: String , token: String): User
    updateUser(id: ID!,imageFile: String, name: String, email: String, password: String): User
    deleteUser(id: ID!): String
    login(email: String!, password: String!): AuthPayload
    forgotPassword(email: String!, password: String!,confirmPassword: String!): AuthPayloadRestPassword
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password:String!
    confirmPassword:String!
    imageFile: String
  }

  type AuthPayload {
    token: String
    user: User
  }
  type AuthPayloadRestPassword {
    email: String
    password:String!
    confirmPassword:String!
  }
`;

module.exports = typeDefs;
