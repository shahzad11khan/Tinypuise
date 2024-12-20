const Sleep = require('../models/sleep');
const authenticate = require("../middleware/auth");

const sleepResolver = {
  Query: {
    getSleep: async (_, { id }) => {
      try {
        const sleep = await Sleep.findById(id);
        if (!sleep) {
          throw new Error('Sleep record not found');
        }
        return sleep;
      } catch (error) {
        throw new Error(`Error fetching sleep record: ${error.message}`);
      }
    },
    getSleeps: async (_, { babyId }) => {
      try {
        return await Sleep.find({ babyId });
      } catch (error) {
        throw new Error(`Error fetching sleep records: ${error.message}`);
      }
    },
  },
  Mutation: {
    addSleep: authenticate(async (parent, args, context) => {
      const { babyId, babyName, sleepDate, startTime, endTime, stopwatchTime, sleepTime } = args;
      const { user } = context;

      if (!user) {
        throw new Error('Unauthorized access');
      }

      const newSleep = new Sleep({
        babyId,
        babyName,
        sleepDate,
        endTime,
        startTime,
        stopwatchTime,
        sleepTime,
        parentName: user.parentName,
        parentId: user.userId,
      });

      try {
        return await newSleep.save();
      } catch (error) {
        throw new Error(`Error adding sleep record: ${error.message}`);
      }
    }),

    updateSleep: authenticate(async (parent, { id, ...updates }) => {
      const { parentName, parentId, ...otherUpdates } = updates; // Ignore parentName and parentId
      try {
        const updatedSleep = await Sleep.findByIdAndUpdate(id, otherUpdates, { new: true });
        if (!updatedSleep) {
          throw new Error('Sleep record not found');
        }
        return updatedSleep;
      } catch (error) {
        throw new Error(`Error updating sleep record: ${error.message}`);
      }
    }),

    deleteSleep: authenticate(async (parent, { id }) => {
      try {
        const sleep = await Sleep.findById(id);
        if (!sleep) {
          throw new Error('Sleep record not found');
        }
        await Sleep.findByIdAndDelete(id);
        return `Sleep record with ID: ${id} has been deleted successfully.`;
      } catch (error) {
        throw new Error(`Error deleting sleep record: ${error.message}`);
      }
    }),
  },
};

module.exports = sleepResolver;
