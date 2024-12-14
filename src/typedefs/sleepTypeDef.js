const { gql } = require('apollo-server-express');

const sleepTypeDef = gql`
  type Sleep {
    id: ID
    babyId: ID
    babyName: String
    sleepDate: String
    beginTime: String
    startTime: String
    stopwatchTime: String
    sleepTime: String
    parentName: String
    parentId: ID
  }

  input SleepInput {
    babyId: ID!
    babyName: String
    sleepDate: String
    beginTime: String
    startTime: String
    stopwatchTime: String
    sleepTime: String
  }

  type Query {
    getSleep(id: ID!): Sleep
    getSleeps(babyId: ID!): [Sleep]
  }

  type Mutation {
    addSleep(
      babyId: ID!
      babyName: String
      sleepDate: String
      beginTime: String
      startTime: String
      stopwatchTime: String
      sleepTime: String
    ): Sleep

    updateSleep(id: ID!, sleepInput: SleepInput): Sleep

    deleteSleep(id: ID!): Sleep
  }
`;

module.exports = sleepTypeDef;
