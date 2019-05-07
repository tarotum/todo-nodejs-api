const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoRoutes = require("./routes/todo");

const config = require("./config");

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", TodoRoutes);

// Conntent DB
mongoose.connect(
  `mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${
    config.db.port
  }/${config.db.name}`,
  { useNewUrlParser: true },
  err => {
    if (err) {
      if (process.env.NODE_ENV !== "testing") {
        global.console.log(`Some problem with the connection ${err}`);
      }
    } else {
      if (process.env.NODE_ENV !== "testing") {
        global.console.log("The Mongoose connection is ready");
      }
      app.listen(
        config.app.port || 5000,
        () =>
          process.env.NODE_ENV !== "testing" &&
          global.console.log(
            `Server is runing on http://localhost:${config.app.port || 5000}`
          )
      );
    }
  }
);
mongoose.set("useCreateIndex", true);

module.exports = app; // for testing
