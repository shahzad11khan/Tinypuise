
const app = require("./app.js");
const { graphqlHTTP } = require("express-graphql");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const dotenv = require("dotenv");
const { typeDefs, resolvers } = require("./schema.js");

dotenv.config();

// Create schema by combining type definitions and resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Set up a route for the root path
app.get('/', (req, res) => {
  res.status(200).send('<h1>Welcome to My Node.js API!</h1><p>This API serves user data. Use the /api/users endpoint to interact with the user resources.</p>');
});

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
