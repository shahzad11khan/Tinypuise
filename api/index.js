const { ApolloServer } = require("apollo-server-micro");
const typeDefs = require("../graphql/typeDefs");
const resolvers = require("../graphql/resolvers");
const context = require("../graphql/context");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    cache: "bounded",
    persistedQueries: false,
});

const startServer = server.start().then(() => {
    module.exports = server.createHandler({ path: "/api" });
});

module.exports = async (req, res) => {
    await startServer;
};
