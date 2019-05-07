/* eslint-disable no-underscore-dangle */
const express = require("express");
const Todo = require("../models/todo");

const Router = express.Router();

/**
 * POST / route for saving new Todo
 */
Router.post("/", async (req, res) => {
  const { title, description } = req.body;
  const todo = new Todo({
    title,
    description
  });

  try {
    const result = await todo.save();
    return res
      .status(201)
      .json({ message: "Todo successful save", ...result._doc });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(206).json(error);
    return res.status(500).json({ message: "Saving todo error", ...error });
  }
});

/**
 * PUT /:id route for updating Todo by id
 */
Router.put("/:id", async (req, res) => {
  try {
    const result = await Todo.findById({ _id: req.params.id });
    if (!result) return res.status(404).json({ message: "Todo not found" });

    await Object.assign(result, req.body).save();

    return res
      .status(200)
      .json({ message: "Todo successful update", ...result._doc });
  } catch (error) {
    return res.status(500).json({ message: "Updating todo error", ...error });
  }
});

/**
 * DELETE /:id route for deleting Todo by id
 */
Router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById({ _id: req.params.id });
    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
    } else {
      await Todo.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Todo successful deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "Deleting todo error", ...error });
  }
});

/**
 * GET /:id route for getting single Todo by id
 */
Router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
    } else {
      res.status(200).json(todo._doc);
    }
  } catch (error) {
    res.status(500).json({ message: "Getting single todo error", ...error });
  }
});

/**
 * GET / route for getting all Todos
 */
Router.get("/", async (req, res) => {
  try {
    const result = await Todo.find({});
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Getting all todos error", ...error });
  }
});

module.exports = Router;
