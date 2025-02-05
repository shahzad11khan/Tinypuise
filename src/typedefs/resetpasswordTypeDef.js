// const { gql } = require("apollo-server-express");

// const typeDefs = gql`
//     type Mutation {
//     generateResetToken(email: String!): String
//     resetPassword(token: String!,resetOTP:String!, password: String!,confirmPassword: String!): AuthPayloadRestPassword
//     }
//     type AuthPayloadRestPassword {
//         token: String
//         userId: String
//     }
// `;
// module.exports = typeDefs;

const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Mutation {
        generateResetToken(email: String!): ResponseMessage
        resetPassword(token: String!, resetOTP: String!, password: String!, confirmPassword: String!): ResponseMessage
    }

    type ResponseMessage {
        success: Boolean!
        message: String!
        data: AuthPayloadRestPassword
    }

    type AuthPayloadRestPassword {
        token: String
        userId: String
    }
`;

module.exports = typeDefs;
