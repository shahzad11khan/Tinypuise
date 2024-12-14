const mongoose = require('mongoose');

const growthSchema = new mongoose.Schema({
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: "BabyInfo", required: true },
  babyName: { type: String },
  date: { type: String },
  weight : {type:String},
  heightInCm : {type:String},
   parentName: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Growth = mongoose.model('Growth', growthSchema);

module.exports = Growth;
