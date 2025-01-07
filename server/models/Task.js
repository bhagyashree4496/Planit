const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  points: [pointSchema],
  createdAt: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TUser",
    required: true,
  }, // Add user reference
});

module.exports = mongoose.model("Task", taskSchema);
