'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const path = require('path');
const nodeSassMiddleware = require('node-sass-middleware');
const bodyParser = require('body-parser');
//const upload = require('multer')({dest: 'tmp/uploads'});

const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const MONGODB_URL = 'mongodb://localhost:27017/node-webserver';

// set global title
app.locals.title = 'THE Super Cool App';

const routes = require('./routes/');

// set view engine to a file ending with .jade in the views folder by default
app.set('view engine', 'jade');


// body-parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//node sass middleware
app.use(nodeSassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true,
  outputStyle: 'compressed',
  debug: true
}));

// able to use static files
app.use(express.static('public'));

app.use(routes);

mongoose.connect(MONGODB_URL);

mongoose.connection.on('open', () => {
  console.log("MONGO OPEN");

  // listen for requests
  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}`);
  });
});

