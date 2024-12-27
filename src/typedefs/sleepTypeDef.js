const { gql } = require('apollo-server-express');

const sleepTypeDef = gql`
  type Sleep {
    id: ID
    babyId: ID
    babyName: String
    sleepDate: String
    startTime: String
    endTime: String
    stopwatchTime: String
    sleepType: String
    parentName: String
    parentId: ID
  }

  input SleepInput {
    babyId: ID!
    babyName: String
    sleepDate: String
    startTime: String
    endTime: String
    stopwatchTime: String
    sleepType: String
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
    startTime: String
    endTime: String
    stopwatchTime: String
    sleepType: String
    ): Sleep

    updateSleep(id: ID!, sleepInput: SleepInput): Sleep

    deleteSleep(id: ID!): Sleep
  }
`;

module.exports = sleepTypeDef;
