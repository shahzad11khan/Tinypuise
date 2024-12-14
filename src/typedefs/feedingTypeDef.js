const { gql } = require('apollo-server-express');

const feedingTypeDef = gql`
  type Feeding {
    id: ID
    babyId: ID
    babyName: String
    feedingTime: String
    amountInMl: Float
    feedingType: String
    beginTime: String
    startTime: String
    date: String
    endTime: String
    stopwatchTime: String
    feedtype: String
    parentName:String
    parentId: ID
  }

  input FeedingInput {
    babyId: ID
    babyName: String
    feedingTime: String
    amountInMl: Float
    feedingType: String
    beginTime: String
    startTime: String
    date: String
    endTime: String
    stopwatchTime: String
    feedtype: String
  }

  type Query {
    getFeeding(id: ID!): Feeding
    getFeedings(babyId: ID!): [Feeding]
  }

  type Mutation {
    addFeeding(
      babyId: ID!
      babyName: String
      feedingTime: String
      amountInMl: Float
      feedingType: String
      beginTime: String
      startTime: String
      date: String
      endTime: String
      stopwatchTime: String
      feedtype: String
    ): Feeding

    updateFeeding(id: ID!, feedingInput: FeedingInput): Feeding

    deleteFeeding(id: ID!): Feeding
  }
`;

module.exports = feedingTypeDef;
