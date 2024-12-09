// /api/graphql.js
import { ApolloServer } from 'apollo-server-micro';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from '../schema/typeDefs';
import resolvers from '../schema/resolvers';

// Load environment variables
dotenv.config();

// Set up MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Apollo Server setup for serverless
export const config = {
  api: {
    bodyParser: false, // Vercel requires body parser to be disabled
  },
};

export default server.createHandler({ path: '/api/graphql' });
