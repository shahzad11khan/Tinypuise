const Feeding = require('../models/feeding');
const authenticate = require("../middleware/auth");


const feedingResolver = {
  Query: {
    getFeeding: async (_, { id }) => {
      return await Feeding.findById(id);
    },
    getFeedings: async (_, { babyId }) => {
      return await Feeding.find({ babyId });
    },
  },
  Mutation: {
    addFeeding: authenticate(async (parent, args, context) =>{
      const { babyId, babyName, feedingTime, amountInMl, feedingType,beginTime,startTime,date,endTime,stopwatchTime }=args;
      const { user } = context; 
      const newFeeding = new Feeding({
        babyId,
        babyName,
        feedingTime,
        amountInMl,
        feedingType,
        beginTime,
        startTime,
        date,
        endTime,
        stopwatchTime,
        parentName: user.parentName, 
        parentId: user.userId, 
      });
      return await newFeeding.save();
    }),

    updateFeeding: authenticate(async (parent, { id, ...updates }) => {
      const { parentName, parentId, ...otherUpdates } = updates;
      return await Feeding.findByIdAndUpdate(id, otherUpdates, { new: true });
    }),

    deleteFeeding: authenticate(async (parent, { id }) => {
      const babyInfo = await Feeding.findById(id);
      if (!babyInfo) {
        throw new Error('Baby information not found');
      }

      try {
        await Feeding.findByIdAndDelete(id);
        return `Baby information with ID: ${id} has been deleted`;
      } catch (error) {
        throw new Error('Error deleting baby information');
      }
    }),

  },
};

module.exports = feedingResolver;
