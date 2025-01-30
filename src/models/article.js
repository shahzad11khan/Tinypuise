const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    image: {
        url: {
          type: String, // URL of the image stored in Cloudinary
          required: false,
        },
        publicId: {
          type: String, // Cloudinary public ID for the image
          required: false,
        },
      },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  mainCategory: {
    type: String,
    required: true,
    enum: ["For You", "General Tips", "Nutrition","Health","Fitness","Diet","Vitamins","Supplements"], // Adjust as needed
  },
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
