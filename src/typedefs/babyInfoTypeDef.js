const { gql } = require('apollo-server-express');

const babyInfoTypeDef = gql`
  type Query {
    allBabyInfos: [BabyInfo]  # Fetches all BabyInfo records
    babyInfo(id: ID!): BabyInfo  # Fetches a single BabyInfo by ID
    myBabyInfos: [BabyInfo]  # Fetches BabyInfo records specific to the authenticated user
  }

  type Mutation {
    addBabyInfo(
      imageFile: String
      babyName: String
      babyDateOfBirth: String
      heightInCm: Float
      weightInKg: Float
      gender:String
    ): BabyInfo

    updateBabyInfo(
      id: ID
      imageFile: String
      babyName: String
      babyDateOfBirth: String
      heightInCm: Float
      weightInKg: Float
      gender:String
    ): BabyInfo

    deleteBabyInfo(id: ID!): String
  }

  type Image {
    url: String
    publicId: String
  }

  type BabyInfo {
    id: ID
    image: Image
    babyName: String
    babyDateOfBirth: String
    heightInCm: Float
    weightInKg: Float
    gender:String
    parentName: String
    parentId: ID
  }
`;

module.exports = babyInfoTypeDef;
