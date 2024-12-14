const mongoose = require('mongoose');

const babyInfoSchema = new mongoose.Schema({
  Im: {
    type: String,
  },
  babyName: {
    type: String,
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
  parentName: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const BabyInfo = mongoose.model('BabyInfo', babyInfoSchema);

module.exports = BabyInfo;
