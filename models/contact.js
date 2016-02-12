'use strict';

const mongoose = require('mongoose');

// create a model to use in /contact to put in db contacts
module.exports = mongoose.model('contacts', mongoose.Schema({
  name: String,
  email: String,
  message: String
})
);
