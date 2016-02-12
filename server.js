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


const api = require('./routes/api');
const calendar = require('./routes/calendar');
const contact = require('./routes/contact');
const routes = require('./routes/routes');
const sendPhoto = require('./routes/send-photo');

// set view engine to a file ending with .jade in the views folder by default
app.set('view engine', 'jade');

app.use(api);
app.use(calendar);
app.use(contact);
app.use(routes);
app.use(sendPhoto);

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

// const backButton = `<a class="back" href="http://localhost:3000/">Back</a>`;
// const title = `.cal.js`;

// set global title
app.locals.title = 'THE Super Cool App';



mongoose.connect(MONGODB_URL);

mongoose.connection.on('open', () => {
  console.log("MONGO OPEN");

  // listen for requests
  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}`);
  });
});

// module.exports = app;

// // mongodb
// //   Use connect method to connect to the Server
// MongoClient.connect(MONGODB_URL, function(err, database) {
//   if (err) throw err;
//   console.log("Connected correctly to server");

//   db = database;

// // listen for requests
//   app.listen(PORT, () => {
//     console.log(`Node.js server started. Listening on port ${PORT}`);
//   });

// });

