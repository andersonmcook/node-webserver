'use strict';

const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const bodyParser = require('body-parser');

// contact.jade
router.get('/contact', (req, res) => {
  res.render('contact');
});

// body-parser middleware
router.use(bodyParser.urlencoded({
  extended: false
}));
router.use(bodyParser.json());

// post
router.post('/contact', (req, res) => {
  console.log("req", req);
  console.log("res", res);
  const obj = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  obj.save((err, newObj) => {
    if (err) throw err;
    console.log(newObj);
    res.send(`<h1>Thanks for contacting us, ${req.body.name}</h1>`);
  });

  // db.collection('contacts').insertOne(obj, (err, result) => {
  //   if (err) throw err;
  //   res.send(`<h1>Thanks for contacting us, ${obj.name}</h1>`);
  // });

  // res.send(`<h1>Thanks for contacting us, ${name}</h1`);
});

module.exports = router;
