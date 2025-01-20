const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { OAuth2Client } = require("google-auth-library");
const { uploadToCloudinary ,updateimage} = require('../middleware/uploadToCloudinary');
const { deleteFromCloudinary } = require('../middleware/deleteFromCloudinary');
const BabyInfo = require('../models/babyInfo');

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
    register: async (_, { imageFile,name, email, password, confirmPassword,token }) => {

      let image = {};
      if(!imageFile){
               image = {
      url: "https://static.thenounproject.com/png/1559144-200.png", // Image URL from Cloudinary
      publicId: "1559144-200" , // Public ID for Cloudinary image
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
        image,
        name,
        email,
        password,
        confirmPassword,
      });

      await newUser.save();
      return newUser;
    },

    // updateUser: async (_, { id,imageFile, name, email, password }) => {
    //   const user = await User.findById(id);
    //   if (!user) {
    //     throw new Error('User not found');
    //   }
    //   if(!password){
    //     throw new Error('Password Is Required');
    //   }
    //   if( password && password !== user.confirmPassword){
    //     throw new Error('Password Is Incorrect');
    //   } 
    //   const FindUserEmail = await User.find();
    //   if ( email === FindUserEmail.email ) {
    //     throw new Error('Email already exists');
    //   }
    //   const updates = {};
    //   if (name) updates.name = name;
    //   if (email) updates.email = email;
    //   if (imageFile) {
    //     // Delete the old image from Cloudinary (if exists)
    //     if (user.image && user.image.publicId) {
    //       try {
    //         await deleteFromCloudinary(user.image.publicId);
    //       } catch (error) {
    //         console.error('Failed to delete old image from Cloudinary:', error);
    //       }
    //     }
    //      // Upload the new image
    //      try {
    //       // const uploadResult = await updateimage(imageFile);
    //       const uploadResult = await uploadToCloudinary(imageFile);
    //       updates.image = {
    //         url: uploadResult.secure_url,
    //         publicId: uploadResult.public_id,
    //       };
    //     } catch (error) {
    //       console.error('Cloudinary Upload Error:', error);
    //       throw new Error('Failed to upload new image');
    //     }
    //   }else{
    //     updates.image = user.image
    //   }
    //   try {
    //     // Update the record in MongoDB
    //     // console.log(updates)
    //     return await User.findByIdAndUpdate(id, updates, { new: true });
    //   } catch (error) {
    //     console.error('Database Update Error:', error);
    //     throw new Error('Failed to update user information');
    //   }
    // },
    updateUser: async (_, { id, imageFile, name, email, password }) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
    
      if (!password) {
        throw new Error('Password is required');
      }
    
      if (password && password !== user.confirmPassword) {
        throw new Error('Password is incorrect');
      }
    
      // Check if the email already exists in the database (excluding the current user)
      if (email) {
        const existingUserWithEmail = await User.findOne({ email });
        if (existingUserWithEmail && existingUserWithEmail.id !== id) {
          throw new Error('Email already in use');
        }
      }
    
      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
    
      if (imageFile) {
        // Delete the old image from Cloudinary (if exists)
        if (user.image && user.image.publicId) {
          try {
            await deleteFromCloudinary(user.image.publicId);
          } catch (error) {
            console.error('Failed to delete old image from Cloudinary:', error);
          }
        }
    
        // Upload the new image
        try {
          const uploadResult = await uploadToCloudinary(imageFile);
          // const uploadResult = await updateimage(imageFile);
          updates.image = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
          };
        } catch (error) {
          console.error('Cloudinary Upload Error:', error);
          throw new Error('Failed to upload new image');
        }
      } else {
        updates.image = user.image;
      }
    
      try {
        // Update the record in MongoDB
        return await User.findByIdAndUpdate(id, updates, { new: true });
      } catch (error) {
        console.error('Database Update Error:', error);
        throw new Error('Failed to update user information');
      }
    },
    
    deleteUser: async (_, { id }) => {
      const user = await User.findById(id);
      console.log(user)
      if (!user) {
        throw new Error('User not found');
      }
      if (user.image && user.image.publicId) {
        try {
          await deleteFromCloudinary(user.image.publicId);
        } catch (error) {
          console.error('Failed to delete image from Cloudinary:', error);
        }
      }
      
      
      await BabyInfo.deleteMany({ parentId: id });
      await User.findByIdAndDelete({_id:id});
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

    forgotPassword: async (_, { email , password, confirmPassword }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('No user found with this email');
      }
      if(password !== confirmPassword){
        throw new Error('Passwords do not match');
      }

      user.password = password;
      user.confirmPassword = confirmPassword;
      await user.save();
    },

  },
};

module.exports = resolvers;
