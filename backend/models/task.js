const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  order: { type: Number, default: 0 } // for ordering / drag-and-drop
});

module.exports = mongoose.model('Task', TaskSchema);
