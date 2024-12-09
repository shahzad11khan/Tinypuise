const { ApolloServer, gql } = require("apollo-server-micro");

// Define your schema
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    hello: () => "Hello, world!",
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded", // Use bounded cache
  persistedQueries: false, // Disable persisted queries for security
});

// Ensure the server starts before creating the handler
const startServer = server.start().then(() => {
  module.exports = server.createHandler({
    path: "/api",
  });
});

// Export the handler
module.exports = async (req, res) => {
  await startServer;
};
