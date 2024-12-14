const { gql } = require('apollo-server-express');

const diaperTypeDef = gql`
  type Diaper {
    id: ID
    babyId: ID!
    babyName: String
    diaperDate: String
    diaperTime: String
    diaperType: String
    parentName: String
    parentId: ID
  }

  input DiaperInput {
    babyId: ID!
    babyName: String
    diaperDate: String
    diaperTime: String
    diaperType: String
  }

  type Query {
    getDiaper(id: ID!): Diaper
    getDiapers(babyId: ID!): [Diaper]
  }

  type Mutation {
    addDiaper(
      babyId: ID!
      babyName: String
      diaperDate: String
      diaperTime: String
      diaperType: String
    ): Diaper

    updateDiaper(id: ID!, diaperInput: DiaperInput): Diaper

    deleteDiaper(id: ID!): Diaper
  }
`;

module.exports = diaperTypeDef;
