'use strict';

const Contact = require('../models/contact');

module.exports.index = (req, res) => {
  res.render('contact');};

module.exports.new = (req, res) => {
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
};
