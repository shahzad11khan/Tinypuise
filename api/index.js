
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const data = [
  {
    completed: false,
    id: "cjl0t6qt2000p3j10f6dd7jnk",
    title: "index overriding Games",
  },
  {
    completed: false,
    id: "cjl0t6qt4001d3j10pho0yqxy",
    title: "target enhance asymmetric",
  },
  {
    completed: false,
    id: "cjl0t6qt4001d3j10pho0yqxy",
    title: "target enhance asymmetric",
  },
  {
    completed: false,
    id: "cjl0t6qt4001d3j10pho0yqxy",
    title: "target enhance asymmetric",
  },
  {
    completed: false,
    id: "cjl0t6qt4001d3j10pho0yqxy",
    title: "target enhance asymmetric",
  },
  {
    completed: false,
    id: "cjl0t6qt4001d3j10pho0yqxy",
    title: "target enhance asymmetric",
  },
];

const typeDefs = gql`
  type Task {
    completed: String
    id: String
    title: String
  }

  type Query {
    tasks: [Task]
  }
`;

const resolvers = {
  Query: {
    tasks: () => data,
  },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/api/index" });

app.listen(3000, () => {
  console.log(
    `Server ready at http://localhost:<span class="math-inline">\{process\.env\.PORT\}</span>{server.graphqlPath}`
  );
});
