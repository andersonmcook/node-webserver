'use strict';

const express = require('express');
const app = express();
const router = express.Router();
// needs to have a dynamic port for heroku to work
const PORT = process.env.PORT || 3000;
const path = require('path');
const nodeSassMiddleware = require('node-sass-middleware');
const bodyParser = require('body-parser');
//const upload = require('multer')({dest: 'tmp/uploads'});

const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGOD_PORT || 27017;
const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PASS = process.env.MONGOD_PASS || '';
const MONGODB_DB = 'node-webserver';
const MONGODB_URL_PREFIX = MONGODB_USER ? `${MONGODB_USER}:${MONGODB_PASS}@` : '';

const MONGODB_URL = `mongodb://${MONGODB_URL_PREFIX}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`;

// set global title
app.locals.title = 'THE Super Cool App';

// looks in routes folder and grabs the index.js by default
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

