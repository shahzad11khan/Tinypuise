const mongoose = require('mongoose');

const diaperSchema = new mongoose.Schema({
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: "BabyInfo", required: true },
  babyName: { type: String},
  diaperDate: { type: String },
  diaperTime: { type: String },
  diaperType: { type: String, enum:["Wet","Solid"],default:"" },
   parentName: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Diaper = mongoose.model('Diaper', diaperSchema);

module.exports = Diaper;
