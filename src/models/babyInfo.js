const mongoose = require('mongoose');

const babyInfoSchema = new mongoose.Schema({
  Im: {
    type: String,
  },
  babyName: {
    type: String,
    trim: true,
  },
  babyDateOfBirth: {
    type: String,
  },
  heightInCm: {
    type: String,
  },
  weightInKg: {
    type: String,
  },
  gender: {
    type: String,
  },
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
  parentName: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

});

const BabyInfo = mongoose.model('BabyInfo', babyInfoSchema);

module.exports = BabyInfo;
