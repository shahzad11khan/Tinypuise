const { gql } = require("apollo-server-micro");

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

module.exports = typeDefs;
