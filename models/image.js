'use strict';

const mongoose = require('mongoose');

// image schema
module.exports = mongoose.model('images', mongoose.Schema({
  url: String
}));
