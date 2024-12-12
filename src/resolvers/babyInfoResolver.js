const BabyInfo = require('../models/babyInfo');

const babyInfoResolver = {
  Query: {
    babyInfos: async () => {
      try {
        return await BabyInfo.find();
      } catch (error) {
        throw new Error('Error fetching baby information');
      }
    },
    getBabyInfo: async (_, { id }) => {
      try {
        return await BabyInfo.findById(id);
      } catch (error) {
        throw new Error('Baby information not found');
      }
    },
  },

  Mutation: {
    addBabyInfo: async (_, { Im, babyName, babyDateOfBirth, heightInCm, weightInKg }) => {
        //  console.log("Input data:", { Im, babyName, babyDateOfBirth, heightInCm, weightInKg });
      const newBabyInfo = new BabyInfo({
        Im,
        babyName,
        babyDateOfBirth,
        heightInCm,
        weightInKg,
      });

   
        await newBabyInfo.save();
        return newBabyInfo;
     
    },

    updateBabyInfo: async (_, { id, Im, babyName, babyDateOfBirth, heightInCm, weightInKg }) => {
      const babyInfo = await BabyInfo.findById(id);
      if (!babyInfo) {
        throw new Error('Baby information not found');
      }

      if (Im) babyInfo.Im = Im;
      if (babyName) babyInfo.babyName = babyName;
      if (babyDateOfBirth) babyInfo.babyDateOfBirth = babyDateOfBirth;
      if (heightInCm) babyInfo.heightInCm = heightInCm;
      if (weightInKg) babyInfo.weightInKg = weightInKg;

      try {
        await babyInfo.save();
        return babyInfo;
      } catch (error) {
        throw new Error('Error updating baby information');
      }
    },

    deleteBabyInfo: async (_, { id }) => {
      const babyInfo = await BabyInfo.findById(id);
      if (!babyInfo) {
        throw new Error('Baby information not found');
      }

      try {
        await BabyInfo.findByIdAndDelete(id);
        return `Baby information with ID: ${id} has been deleted`;
      } catch (error) {
        throw new Error('Error deleting baby information');
      }
    },
  },
};

module.exports = babyInfoResolver;
