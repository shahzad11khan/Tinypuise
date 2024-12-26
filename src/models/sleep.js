const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: "BabyInfo", required: true },
  babyName: { type: String },
  sleepDate: { type: String },
  startTime : {type:String},
  endTime : {type:String},
  stopwatchTime: {type:String},
  sleepType: { type: String, enum: ['Morning', 'Night'], default:"" },
  parentName: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Sleep = mongoose.model('Sleep', sleepSchema);

module.exports = Sleep;
