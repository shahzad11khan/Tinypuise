const { gql } = require("apollo-server-express");

const typeDefs = gql`

  type Image {
    url: String
    publicId: String
  }
  type Item {
    id: ID!
    image: Image
    title: String!
    description: String!
    mainCategory: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    getItems: [Item]
    getItem(id: ID!): Item
  }

  type Mutation {
    addItem(imageFile: String!, title: String!, description: String!, mainCategory: String!): Item
    updateItem(id: ID!, imageFile: String, title: String, description: String, mainCategory: String): Item
    deleteItem(id: ID!): String
  }
`;

module.exports = typeDefs;
