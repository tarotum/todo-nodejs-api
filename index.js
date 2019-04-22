const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ENV = require('dotenv');
const TodoRoutes = require('./routes/todo');

ENV.config();

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', TodoRoutes);

// Conntent DB
mongoose.connect(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  { useNewUrlParser: true },
  err => {
    if (err) {
      global.console.log(`Some problem with the connection ${err}`);
    } else {
      global.console.log('The Mongoose connection is ready');
      app.listen(process.env.PORT, () =>
        global.console.log(`Server is runing on http://localhost:${process.env.PORT}`)
      );
    }
  }
);
mongoose.set('useCreateIndex', true);
