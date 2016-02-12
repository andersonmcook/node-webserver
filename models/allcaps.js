'use strict';

const mongoose = require('mongoose');

// loose schema for allcaps
module.exports = mongoose.model('allcaps', mongoose.Schema({}, {strict: false}));
