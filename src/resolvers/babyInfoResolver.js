
const BabyInfo = require('../models/babyInfo');
const authenticate = require("../middleware/auth");
const {uploadToCloudinary,updateimage} = require("../middleware/uploadToCloudinary");
const {deleteFromCloudinary} = require("../middleware/deleteFromCloudinary");
const fs = require('fs');

const babyInfoResolver = {
  Query: {
    allBabyInfos: async () => {
      try {
        return await BabyInfo.find();
      } catch (error) {
        throw new Error('Error fetching baby information');
      }
    },
    babyInfo: async (_, { id }) => {
      try {
        return await BabyInfo.findById(id);
      } catch (error) {
        throw new Error('Baby information not found');
      }
    },
    myBabyInfos: authenticate(async (parent, args, context) => {
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
    addBabyInfo: authenticate(async (parent, args, context) => {
      const { Im, imageFile, babyName,gender, babyDateOfBirth, heightInCm, weightInKg } = args;

      if (!babyInfo) {
        throw new Error('Baby information not found');
      }
      let image = {};
      // Upload the image to Cloudinary (if provided)
            if(!imageFile){
                     image = {
            url: "https://png.pngtree.com/thumb_back/fh260/background/20230617/pngtree-cute-baby-blue-eyes-girls-wallpapers-image_2948599.jpg", // Image URL from Cloudinary
            publicId: null , // Public ID for Cloudinary image
          };
            }else {
        try {

          const uploadResult = await uploadToCloudinary(imageFile);
          image = {
            url: uploadResult.secure_url, // Image URL from Cloudinary
            publicId: uploadResult.public_id, // Public ID for Cloudinary image
          };
        } catch (error) {
          console.error('Cloudinary Upload Error:', error);
          throw new Error('Failed to upload image');
        }
      }

      // Ensure the user is authenticated
      const { user } = context;
      if (!user) {
        throw new Error('Authentication required');
      }
      const babyInfo = await BabyInfo.findOne({
        $and: [
          { babyName: babyName },
          { parentName: user.parentName } // Assuming parentName is a variable holding the parent's name
        ]
      });    

      if (babyInfo) {
        throw new Error('Baby information with the same name already exists');
      }
      
      const newBabyInfo = new BabyInfo({
        image, // Store image details
        babyName,
        Im, 
        babyDateOfBirth,
         gender,
        heightInCm,
        weightInKg,
        parentName: user.parentName,
        parentId: user.userId,
      });

      try {
        return await newBabyInfo.save(); // Save to database
      } catch (error) {
        console.error('Database Save Error:', error);
        throw new Error('Failed to save baby information');
      }
    }),

    // updateBabyInfo: authenticate(async (parent, args, context) => {
    //   const { Im, imageFile, babyName,gender, babyDateOfBirth, heightInCm, weightInKg } = args;
    //   // Fetch the existing record
    //   console.log(id)
    //   console.log(updates)
    //   console.log(imageFile)

    //   const babyInfo = await BabyInfo.findById(id);
    //   if (!babyInfo) {
    //     throw new Error('Baby information not found');
    //   }

    //   // If a new image is provided, upload it to Cloudinary
    //   if (imageFile) {
    //     // Delete the old image from Cloudinary (if exists)
    //     if (babyInfo.image && babyInfo.image.publicId) {
    //       try {
    //         await deleteFromCloudinary(babyInfo.image.publicId);
    //       } catch (error) {
    //         console.error('Failed to delete old image from Cloudinary:', error);
    //       }
    //     }

    //     // Upload the new image
    //     try {
    //       const uploadResult = await uploadImage(imageFile);
    //       updates.image = {
    //         url: uploadResult.secure_url,
    //         publicId: uploadResult.public_id,
    //       };
    //     } catch (error) {
    //       console.error('Cloudinary Upload Error:', error);
    //       throw new Error('Failed to upload new image');
    //     }
    //   }

    //   try {
    //     // Update the record in MongoDB
    //     return await BabyInfo.findByIdAndUpdate(id, updates, { new: true });
    //   } catch (error) {
    //     console.error('Database Update Error:', error);
    //     throw new Error('Failed to update baby information');
    //   }
    // }),
    updateBabyInfo: authenticate(async (parent, args, context) => {
      const { id, imageFile, babyName, gender, babyDateOfBirth, heightInCm, weightInKg } = args;

      // Ensure the user is authenticated
    
      // Fetch the existing record
      const babyInfo = await BabyInfo.findById(id);
      if (!babyInfo) {
        throw new Error('Baby information not found');
      }
    
      // Prepare the update object
      const updates = {};
    
      // If any of the fields are provided, add them to the update object
      if (babyName) updates.babyName = babyName;
      if (gender) updates.gender = gender;
      if (babyDateOfBirth) updates.babyDateOfBirth = babyDateOfBirth;
      if (heightInCm) updates.heightInCm = heightInCm;
      if (weightInKg) updates.weightInKg = weightInKg;
    
      // If a new image is provided, upload it to Cloudinary
      if (imageFile) {
        // Delete the old image from Cloudinary (if exists)
        if (babyInfo.image && babyInfo.image.publicId) {
          try {
            await deleteFromCloudinary(babyInfo.image.publicId);
          } catch (error) {
            console.error('Failed to delete old image from Cloudinary:', error);
          }
        }
    
        // Upload the new image
        try {
          const uploadResult = await updateimage(imageFile);
          updates.image = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
          };
        } catch (error) {
          console.error('Cloudinary Upload Error:', error);
          throw new Error('Failed to upload new image');
        }
      }
    
      try {
        // Update the record in MongoDB
        return await BabyInfo.findByIdAndUpdate(id, updates, { new: true });
      } catch (error) {
        console.error('Database Update Error:', error);
        throw new Error('Failed to update baby information');
      }
    }),
    
 
    deleteBabyInfo: authenticate(async (parent, { id }) => {
      // Fetch the baby information
      const babyInfo = await BabyInfo.findById(id);
      if (!babyInfo) {
        throw new Error('Baby information not found');
      }

      // Delete the associated image from Cloudinary (if exists)
      if (babyInfo.image && babyInfo.image.publicId) {
        try {
          await deleteFromCloudinary(babyInfo.image.publicId);
        } catch (error) {
          console.error('Failed to delete image from Cloudinary:', error);
        }
      }

      try {
        // Delete the record from MongoDB
        await BabyInfo.findByIdAndDelete(id);
        return `Baby information with ID: ${id} has been successfully deleted`;
      } catch (error) {
        console.error('Database Deletion Error:', error);
        throw new Error('Failed to delete baby information');
      }
    }),
  },
};

module.exports = babyInfoResolver;

