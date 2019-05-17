/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");

// const mongoose = require("mongoose");
const server = require("../index");
const Todo = require("../models/todo");

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

describe("Todos", () => {
  // remove all todos before run test
  beforeEach(done => {
    Todo.deleteOne({}, () => {
      done();
    });
  });

  describe("/GET Get all todos", () => {
    it("It should GET empty array of todos", done => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe("/POST todo", () => {
    /**
     *  Validate title field
     */

    it("It should not POST a todo without title field", done => {
      const todo = {};

      chai
        .request(server)
        .post("/")
        .send(todo)
        .end((err, res) => {
          res.should.have.status(206);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("title");
          res.body.errors.title.should.have.property("kind").eql("required");
          done();
        });
    });

    /**
     *  Validate completed field
     */

    it("It should POST a todo without completed field (because completed has default = false)", done => {
      const todo = {
        title: "Test todo title"
      };

      chai
        .request(server)
        .post("/")
        .send(todo)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("completed").eql(false);
          done();
        });
    });

    /**
     *  Test success post saving
     */

    it("It should POST a todo", done => {
      const todo = {
        title: "Test todo title"
      };

      chai
        .request(server)
        .post("/")
        .send(todo)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("title").eql(todo.title);
          res.body.should.have.property("completed").eql(false);
          done();
        });
    });
  });

  describe("/GET:ID todo", () => {
    it("It should GET a todo by the given id", done => {
      const newTodo = new Todo({
        title: "Test todo title"
      });

      newTodo.save((err, todo) => {
        chai
          .request(server)
          .get(`/${todo.id}`)
          .send(todo)
          .end((errors, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("_id").eql(todo.id);
            res.body.should.have.property("title").eql(todo.title);
            res.body.should.have.property("completed").eql(false);
            done();
          });
      });
    });
  });

  describe("/PUT/:ID todo", () => {
    it("It should UPDATE todo given by id", done => {
      const newTodo = new Todo({
        title: "Test todo title"
      });

      const updatedTodo = {
        title: "Test todo title update",
        completed: true
      };

      newTodo.save((err, todo) => {
        chai
          .request(server)
          .put(`/${todo.id}`)
          .send(updatedTodo)
          .end((errors, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Todo successful update");
            res.body.should.have.property("_id").eql(todo.id);
            res.body.should.have.property("title").eql(updatedTodo.title);
            res.body.should.have
              .property("completed")
              .eql(updatedTodo.completed);
            done();
          });
      });
    });
  });

  describe("/DELETE/:ID todo", () => {
    it("It should DELETE todo given by id", done => {
      const newTodo = new Todo({
        title: "Test todo title"
      });

      newTodo.save((err, todo) => {
        chai
          .request(server)
          .delete(`/${todo.id}`)
          .end((errors, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Todo successful deleted");
            done();
          });
      });
    });
  });
});
