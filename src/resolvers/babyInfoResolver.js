const BabyInfo = require('../models/babyInfo');
const authenticate = require("../middleware/auth");

const babyInfoResolver = {
  Query: {
    babyInfos:async ()=> {
      try {
        return await BabyInfo.find();
      } catch (error) {
        throw new Error('Error fetching baby information');
      }
    },
    babyInfoo: async (_, { id }) => {
      try {
        return await BabyInfo.findById(id);
      } catch (error) {
        throw new Error('Baby information not found');
      }
    },
    babyInfos: authenticate(async (parent, args, context) => {
      try {
        const { user } = context; // Retrieve the authenticated user from the context
        const parentId = user.userId; // Assuming `userId` is available in the context
        
        // Fetch the baby information where the parentId matches the logged-in user's ID
        const babies = await BabyInfo.find({ parentId });
        
        return babies;
      } catch (error) {
        throw new Error('Error fetching baby information');
      }
    })
    
 
  },

  Mutation: {
    // addBabyInfo: async (_, { Im, babyName, babyDateOfBirth, heightInCm, weightInKg,parentName, parentId }) => {
    //     //  console.log("Input data:", { Im, babyName, babyDateOfBirth, heightInCm, weightInKg });
    //   const newBabyInfo = new BabyInfo({
    //     Im,
    //     babyName,
    //     babyDateOfBirth,
    //     heightInCm,
    //     weightInKg,
    //     parentName,
    //     parentId,
    //   });

   
    //     await newBabyInfo.save();
    //     return newBabyInfo;
     
    // },
    addBabyInfo: authenticate(async (parent, args, context) => {
      const { babyName, babyDateOfBirth, heightInCm, weightInKg } = args;
      console.log(babyName, babyDateOfBirth, heightInCm, weightInKg );
      // console.log(context)
      const { user } = context; 
      // console.log(user)
      const newBabyInfo = new BabyInfo({
        babyName,
        babyDateOfBirth,
        heightInCm,
        weightInKg,
        parentName: user.parentName, 
        parentId: user.userId, 
      });
      return await newBabyInfo.save();
    }),
    updateBabyInfo: authenticate(async (parent, { id, ...updates }) => {
      const { parentName, parentId, ...otherUpdates } = updates;
      return await BabyInfo.findByIdAndUpdate(id, otherUpdates, { new: true });
    }),

    deleteBabyInfo: authenticate(async (parent, { id }) => {
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
    }),
  },
};

module.exports = babyInfoResolver;
