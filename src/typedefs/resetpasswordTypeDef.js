const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Mutation {
    generateResetToken(email: String!): String
    resetPassword(token: String!, password: String!,confirmPassword: String!): AuthPayloadRestPassword
    }
    type AuthPayloadRestPassword {
        token: String
        userId: String
    }
`;
module.exports = typeDefs;