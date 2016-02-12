'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contact');

//chained routes
// GET /contact & POST /contact
// contact.jade
router.get('/', ctrl.index).post('/', ctrl.new);

module.exports = router;
