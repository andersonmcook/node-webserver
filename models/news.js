'use strict';

const mongoose = require('mongoose');

// create a model to use in /api/news to put in db news
module.exports = mongoose.model('news', mongoose.Schema({
  top: [
    {
      title: String,
      url: String
    }
  ]
})
);
