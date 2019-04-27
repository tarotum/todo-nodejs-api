const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ENV = require('dotenv');
const TodoRoutes = require('./routes/todo');

ENV.config();
const { PORT, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', TodoRoutes);

// Conntent DB
mongoose.connect(
  `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  { useNewUrlParser: true },
  err => {
    if (err) {
      global.console.log(`Some problem with the connection ${err}`);
    } else {
      global.console.log('The Mongoose connection is ready');
      app.listen(PORT || 5000, () =>
        global.console.log(`Server is runing on http://localhost:${PORT || 5000}`)
      );
    }
  }
);
mongoose.set('useCreateIndex', true);
