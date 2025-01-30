const Item = require("../models/article");
const { uploadToCloudinary } = require('../middleware/uploadToCloudinary');
const { deleteFromCloudinary } = require('../middleware/deleteFromCloudinary');

const resolvers = {
    Query: {
        // Get all items
        getItems: async () => {
            return await Item.find();
        },

        // Get a single item by ID
        getItem: async (_, { id }) => {
            return await Item.findById(id);
        },
    },

    Mutation: {
        // Add new item
        addItem: async (_, { imageFile, title, description, mainCategory }) => {
            let image = {};
            if (!imageFile) {
                image = {
                    url: "https://static.thenounproject.com/png/1559144-200.png", // Image URL from Cloudinary
                    publicId: "1559144-200", // Public ID for Cloudinary image
                };
            } else {
                try {
                    const uploadResult = await uploadToCloudinary(image);
                    image = {
                        url: uploadResult.secure_url, // Image URL from Cloudinary
                        publicId: uploadResult.public_id, // Public ID for Cloudinary image
                    };
                } catch (error) {
                    console.error('Cloudinary Upload Error:', error);
                    throw new Error('Failed to upload image');
                }
            }
            const newItem = new Item({ image, title, description, mainCategory });
            await newItem.save();
            return newItem;
        },

        // Update existing item
        updateItem: async (_, { id, imageFile, title, description, mainCategory }) => {
            const user = await Item.findById(id);
            const updates = {};
            if (title) updates.title = title;
            if (description) updates.description = description;
            if (mainCategory) updates.mainCategory = mainCategory;
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
                  // const uploadResult = await uploadToCloudinary(image);
                  const uploadResult = await updateimage(imageFile);
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
                return await Item.findByIdAndUpdate(id, updates, { new: true });
              } catch (error) {
                console.error('Database Update Error:', error);
                throw new Error('Failed to update user information');
              }
        },

        // Delete an item
        deleteItem: async (_, { id }) => {
            const user = await Item.findById(id);
            await Item.findByIdAndDelete(id);
            if (user.image && user.image.publicId) {
                try {
                  await deleteFromCloudinary(user.image.publicId);
                } catch (error) {
                  console.error('Failed to delete image from Cloudinary:', error);
                }
              }
        },
    },
};

module.exports = resolvers;
