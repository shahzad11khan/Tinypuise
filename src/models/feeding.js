const mongoose = require('mongoose');

const feedingSchema = new mongoose.Schema({
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: "BabyInfo", required: true },
  babyName: { type: String, },
  feedingTime: { type: String, },
  amountInMl: { type: Number,},
  feedingType: { type: String,enum:["Nursing","Bottle"],default:"Nursing"},
  beginTime : {type:String},
  startTime : {type:String},
  date : {type:String},
  endTime : {type:String},
  stopwatchTime: {type:String},
  parentName: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Feeding = mongoose.model('Feeding', feedingSchema);

module.exports = Feeding;
