const { gql } = require('apollo-server-express');

const babyInfoTypeDef = gql`
  type Query {
    allBabyInfos: [BabyInfo] # Fetches all BabyInfo records
  babyInfo(id: ID!): BabyInfo # Fetches a single BabyInfo by ID
  myBabyInfos: [BabyInfo] # Fetches BabyInfo records specific to the authenticated user
  }

  type Mutation {
    addBabyInfo(
      Im: String
      babyName: String
      babyDateOfBirth: String
      heightInCm: Float
      weightInKg: Float
    ): BabyInfo

    updateBabyInfo(
      id: ID
      Im: String
      babyName: String
      babyDateOfBirth: String
      heightInCm: Float
      weightInKg: Float
      parentName: String
      parentId: ID
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
    parentName: String
    parentId: ID
  }
`;

module.exports = babyInfoTypeDef;
