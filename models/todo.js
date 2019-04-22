const mongoose = require('mongoose');

const { Schema } = mongoose;

const todoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Todo', todoSchema);
