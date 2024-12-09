// /api/graphql.js

import { ApolloServer } from 'apollo-server-vercel'; // Using Vercel-specific Apollo server
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schema/typeDefs'; // Adjust path if necessary
import resolvers from './schema/resolvers'; // Adjust path if necessary

dotenv.config();

let isConnected = false; // MongoDB connection tracking

// MongoDB connection handling for serverless
const connectToDatabase = async () => {
  if (isConnected) return; // If already connected, do nothing
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
};

const handler = async (req, res) => {
  // Ensure MongoDB connection
  await connectToDatabase();

  // Set up Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  return server.createHandler({ path: "/api/graphql" })(req, res);
};

export default handler;
