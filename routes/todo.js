const express = require('express');
const Todo = require('../models/todo');

const Router = express.Router();

// Create todo
Router.post('/', async (req, res) => {
  const { title, description, completed } = req.body;
  const todo = new Todo({
    title,
    description,
    completed
  });

  try {
    const result = await todo.save();
    // eslint-disable-next-line no-underscore-dangle
    res.status(201).json(result._doc);
  } catch (error) {
    res.status(500).json(error);
  }
});
// Update todo
Router.put('/:id', async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const result = await Todo.findById({ _id: req.params.id });
    if (!result) return res.status(404).json('Todo not found.');

    result.title = title || result.title;
    result.description = description || result.description;
    result.completed = completed;
    await result.save();
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json(result._doc);
  } catch (error) {
    return res.status(500).json(error);
  }
});
// Remove todo
Router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById({ _id: req.params.id });
    if (!todo) {
      res.status(404).json('Todo not found.');
    } else {
      await Todo.deleteOne({ _id: req.params.id });
      res.status(200).json('Deleted.');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// Get one todo by id
Router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    if (!todo) {
      res.status(404).json('Todo not found! :c');
    } else {
      /* eslint-disable no-underscore-dangle */
      res.status(200).json(todo._doc);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// Get all
Router.get('/', async (req, res) => {
  try {
    const result = await Todo.find({});
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = Router;
