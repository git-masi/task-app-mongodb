const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

taskSchema.methods.toJSON = function () {
  const task = this;
  const taskObj = { description: task.description, completed: task.completed };

  return taskObj;
}

const Task = mongoose.model('Task', taskSchema)

module.exports = Task;