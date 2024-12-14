const Diaper = require('../models/diaper');
const authenticate = require("../middleware/auth");

const diaperResolver = {
  Query: {
    getDiaper: async (_, { id }) => {
      try {
        const diaper = await Diaper.findById(id);
        if (!diaper) {
          throw new Error('Diaper information not found');
        }
        return diaper;
      } catch (error) {
        throw new Error(`Error fetching diaper information: ${error.message}`);
      }
    },
    getDiapers: async (_, { babyId }) => {
      try {
        return await Diaper.find({ babyId });
      } catch (error) {
        throw new Error(`Error fetching diapers: ${error.message}`);
      }
    },
  },
  Mutation: {
    addDiaper: authenticate(async (parent, args, context) => {
      const { babyId, babyName, diaperDate, diaperTime, diaperType } = args;
      const { user } = context;

      if (!user) {
        throw new Error('Unauthorized access');
      }

      const newDiaper = new Diaper({
        babyId,
        babyName,
        diaperDate,
        diaperTime,
        diaperType,
        parentName: user.parentName,
        parentId: user.userId,
      });

      try {
        return await newDiaper.save();
      } catch (error) {
        throw new Error(`Error adding diaper: ${error.message}`);
      }
    }),

    updateDiaper: authenticate(async (parent, { id, ...updates }) => {
      const { parentName, parentId, ...otherUpdates } = updates; // Ignore parentName and parentId
      try {
        const updatedDiaper = await Diaper.findByIdAndUpdate(id, otherUpdates, { new: true });
        if (!updatedDiaper) {
          throw new Error('Diaper information not found');
        }
        return updatedDiaper;
      } catch (error) {
        throw new Error(`Error updating diaper: ${error.message}`);
      }
    }),

    deleteDiaper: authenticate(async (parent, { id }) => {
      try {
        const diaper = await Diaper.findById(id);
        if (!diaper) {
          throw new Error('Diaper information not found');
        }
        await Diaper.findByIdAndDelete(id);
        return `Diaper information with ID: ${id} has been deleted successfully.`;
      } catch (error) {
        throw new Error(`Error deleting diaper information: ${error.message}`);
      }
    }),
  },
};

module.exports = diaperResolver;
