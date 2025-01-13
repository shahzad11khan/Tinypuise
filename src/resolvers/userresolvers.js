const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { OAuth2Client } = require("google-auth-library");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(
  "287540115183-ia19hgvs0lgum4b9ufgkiv30g4d2euoq.apps.googleusercontent.com"
);

const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },
  },

  Mutation: {
    register: async (_, { name, email, password, confirmPassword,token }) => {
      if(token){
        const ticket = await client.verifyIdToken({
          idToken: token
        })      
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = new User({
        name,
        email,
        password,
        confirmPassword,
      });

      await newUser.save();
      return newUser;
    },

    updateUser: async (_, { id, name, email, password }) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      await user.save();
      return user;
    },

    deleteUser: async (_, { id }) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      await User.findByIdAndDelete(id);
      return `User with ID: ${id} has been deleted`;
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign({ userId: user.id,parentName: user.name,email: user.email  }, JWT_SECRET, { expiresIn: '1y' });
      return {
        token,
        user,
      };
    },
  },
};

module.exports = resolvers;
