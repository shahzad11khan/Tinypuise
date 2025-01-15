const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { OAuth2Client } = require("google-auth-library");
const { uploadToCloudinary } = require('../middleware/uploadToCloudinary');
const { deleteFromCloudinary } = require('../middleware/deleteFromCloudinary');

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
    //       const uploadResult = await uploadToCloudinary(imageFile);
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
    //     return await user.findByIdAndUpdate(id, updates, { new: true });
    //   } catch (error) {
    //     console.error('Database Update Error:', error);
    //     throw new Error('Failed to update baby information');
    //   }
    // },
    updateUser: async (_, { id, imageFile, name, email, password }) => {
      // Find the user by ID
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
    
      // Validate password
      if (!password) {
        throw new Error('Password is required');
      }
      if (password !== user.confirmPassword) { // Ensure confirmPassword is securely stored
        throw new Error('Password is incorrect');
      }
    
      // Initialize updates object
      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
    
      // Handle image file if provided
      if (imageFile) {
        // Delete the old image from Cloudinary if it exists
        if (user.image && user.image.publicId) {
          try {
            await deleteFromCloudinary(user.image.publicId);
          } catch (error) {
            console.error('Failed to delete old image from Cloudinary:', error);
            throw new Error('Error while deleting old image');
          }
        }
    
        // Upload the new image to Cloudinary
        try {
          const uploadResult = await uploadToCloudinary(imageFile);
          updates.image = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
          };
        } catch (error) {
          console.error('Cloudinary Upload Error:', error);
          throw new Error('Failed to upload new image');
        }
      }
    
      // Update user in the database
      try {
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
          throw new Error('Failed to update user information');
        }
        return updatedUser;
      } catch (error) {
        console.error('Database Update Error:', error);
        throw new Error('Failed to update user information');
      }
    },
    
    deleteUser: async (_, { id }) => {
      const user = await User.findById(id);
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
