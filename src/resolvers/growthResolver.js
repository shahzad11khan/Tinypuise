const Growth = require('../models/growth');
const authenticate = require("../middleware/auth");

const growthResolver = {
  Query: {
    getGrowth: async (_, { id }) => {
      try {
        const growth = await Growth.findById(id);
        if (!growth) {
          throw new Error('Growth record not found');
        }
        return growth;
      } catch (error) {
        throw new Error(`Error fetching growth record: ${error.message}`);
      }
    },
    getGrowths: async (_, { babyId }) => {
      try {
        return await Growth.find({ babyId });
      } catch (error) {
        throw new Error(`Error fetching growth records: ${error.message}`);
      }
    },
  },
  Mutation: {
    addGrowth: authenticate(async (parent, args, context) => {
      const { babyId, babyName, date, weight, heightInCm } = args;
      const { user } = context;

      if (!user) {
        throw new Error('Unauthorized access');
      }

      const newGrowth = new Growth({
        babyId,
        babyName,
        date,
        weight,
        heightInCm,
        parentName: user.parentName,
        parentId: user.userId,
      });

      try {
        return await newGrowth.save();
      } catch (error) {
        throw new Error(`Error adding growth record: ${error.message}`);
      }
    }),

    updateGrowth: authenticate(async (parent, { id, ...updates }) => {
      const { parentName, parentId, ...otherUpdates } = updates; // Ignore parentName and parentId
      try {
        const updatedGrowth = await Growth.findByIdAndUpdate(id, otherUpdates, { new: true });
        if (!updatedGrowth) {
          throw new Error('Growth record not found');
        }
        return updatedGrowth;
      } catch (error) {
        throw new Error(`Error updating growth record: ${error.message}`);
      }
    }),

    deleteGrowth: authenticate(async (parent, { id }) => {
      try {
        const growth = await Growth.findById(id);
        if (!growth) {
          throw new Error('Growth record not found');
        }
        await Growth.findByIdAndDelete(id);
        return `Growth record with ID: ${id} has been deleted successfully.`;
      } catch (error) {
        throw new Error(`Error deleting growth record: ${error.message}`);
      }
    }),
  },
};

module.exports = growthResolver;
