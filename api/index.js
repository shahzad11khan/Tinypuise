const { ApolloServer, gql } = require('apollo-server-micro');
const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};
const apolloServer = new ApolloServer({ typeDefs, resolvers });

module.exports = apolloServer.createHandler();
