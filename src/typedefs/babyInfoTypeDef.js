const { gql } = require('apollo-server-express');

const babyInfoTypeDef = gql`
  type Query {
    babyInfos: [BabyInfo]
    getBabyInfo(id: ID!): BabyInfo
  }

  type Mutation {
    addBabyInfo(
      Im: String!
      babyName: String!
      babyDateOfBirth: String!
      heightInCm: Float!
      weightInKg: Float!
    ): BabyInfo
    updateBabyInfo(
      id: ID!
      Im: String
      babyName: String
      babyDateOfBirth: String
      heightInCm: Float
      weightInKg: Float
    ): BabyInfo
    deleteBabyInfo(id: ID!): String
  }

  type BabyInfo {
    id: ID
    Im: String
    babyName: String
    babyDateOfBirth: String
    heightInCm: Float
    weightInKg: Float
  }
`;

module.exports = babyInfoTypeDef;
