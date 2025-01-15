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

  
  type Image {
    url: String
    publicId: String
  }
  type User {
    id: ID!
    name: String!
    email: String!
    password:String!
    confirmPassword:String!
    image: Image
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
