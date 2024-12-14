const { gql } = require('apollo-server-express');

const GrowthTypeDef = gql`
  type Growth {
    id: ID
    babyId: ID
    babyName: String
    date: String
    weight: String
    heightInCm: String
    parentName: String
    parentId: ID
  }

  input GrowthInput {
    babyId: ID
    babyName: String
    date: String
    weight: String
    heightInCm: String
  }

  type Query {
    getGrowth(id: ID!): Growth
    getGrowths(babyId: ID!): [Growth]
  }

  type Mutation {
    addGrowth(
      babyId: ID!
      babyName: String
      date: String
      weight: String
      heightInCm: String
    ): Growth

    updateGrowth(id: ID!, growthInput: GrowthInput): Growth

    deleteGrowth(id: ID!): Growth
  }
`;

module.exports = GrowthTypeDef;
