const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  completed: { type: Boolean, default: false },
});

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel;
