'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');
const Image = require('../models/image');
const Contact = require('../models/contact');
// const wholeMonth = require('node-cal/lib/month').wholeMonth;
// const calendar = require('node-cal/lib/year').calendar;
const backButton = `<a class="back" href="http://localhost:3000/">Back</a>`;
const title = `.cal.js`;

// using jade to render index.jade
router.get('/jade', (req, res) => {
  res.render('index');
});

// hello world page
router.get('/hello', (req, res) => {
  const name = req.query.name || "user";
  const msg = `<h1>Hello ${name}!</h1><h1>Goodbye ${name}!</h1>`;
  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(`<head><title>Hello ${name}</title>
      <link rel="stylesheet" type="text/css" href="http://localhost:3000/white.css">
    </head>
    ${backButton}`);
// split msg so that it prints out slowly
  msg.split("").forEach((char, i) => {
    setTimeout(() => {
      res.write(char);
    }, 100 * i);
  });
  setTimeout(() => {
    res.end();
  }, 20000);
});

// changed app to router below, switch if

// random num gen between min and max
router.get('/random/:min/:max', (req, res) => {
  const min = req.params.min;
  const max = req.params.max;
  res.send(`
    <head><title>RNG between ${min} and ${max}</title>
      <link rel="stylesheet" type="text/css" href="http://localhost:3000/white.css">
    </head>
    ${backButton}
    <h1>${parseInt(Math.random() * (max - min) + min)}</h1>`);
});



// random num gen page
router.get('/random', (req, res) => {
  res
    .status(200)
    .send(`
      <head><title>RNG</title>
        <link rel="stylesheet" type="text/css" href="http://localhost:3000/white.css">
      </head>
      ${backButton}
      <h1>${Math.random()}</h1>`);
});

// 403 page
router.get('/secret', (req, res) => {
  res
    .status(403)
    .send(403, `${backButton}
      <h1>Access Denied</h1>`);
});

// main page with links to other pages
router.get('/', (req, res) => {
  res.status(200).send(`
    <head><title>Main</title>
      <link rel="stylesheet" type="text/css" href="http://localhost:3000/white.css">
    </head>
    <h1>Links</h1>
    <ul>
      <li><a href="/hello">Hello</a></li>
      <li><a href="/hello?name=Anderson">Hello Anderson</a></li>
      <li><a href="/random">Random Number Generator</a></li>
      <li><a href="/random/6/90">Random Number Generator between 6 and 90</a></li>
      <li><a href="/cal">Calendar for this month</a></li>
      <li><a href="/cal/2017">Calendar for 2017</a></li>
      <li><a href="/cal/12/1999">Calendar for December 1999</a></li>
      <li><a href="/jade">Rendered with Jade</a></li>
    </ul>`);
});

module.exports = router;
