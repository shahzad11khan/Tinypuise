const mongoose = require('mongoose');

const babyInfoSchema = new mongoose.Schema({
  Im: {
    type: String,
    required: true, 
  },
  babyName: {
    type: String,
    required: true,
  },
  babyDateOfBirth: {
    type: Date,
    required: true,
  },
  heightInCm: {
    type: Number,
    required: true,
  },
  weightInKg: {
    type: Number,
    required: true,
  },
});

const BabyInfo = mongoose.model('BabyInfo', babyInfoSchema);

module.exports = BabyInfo;
