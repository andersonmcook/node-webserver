'use strict';

const express = require('express');
const router = express.Router();
const wholeMonth = require('node-cal/lib/month').wholeMonth;
const calendar = require('node-cal/lib/year').calendar;
// const backButton = `<a class="back" href="http://localhost:3000/">Back</a>`;
const title = `.cal.js`;

// month calendar
router.get('/cal/:month/:year', (req, res) => {
  const month = parseInt(req.params.month);
  const year = parseInt(req.params.year);
  month < 1 || month > 12 ? res.status(200).send(`<code>Pick a month between 1 and 12</code`) : month;
  year > 9999 || year < 1783 ? res.status(200).send(`<code>Pick a year between 1783 and 9999</code>`) : year;
  const days = wholeMonth(year, month).replace(/ /g, "&nbsp;").split("\n").join("<br>");
  res.status(200).send(`
    <head>
      <title>Calendar for ${month} ${year}</title>
      <link rel="stylesheet" type="text/css" href="style.css">
    </head>
    <code>${days}</code>`);
});

//year calendar
router.get('/cal/:year', (req, res) => {
  const year = parseInt(req.params.year);
  year > 9999 || year < 1783 ? res.status(200).send(`<code>Pick a year between 1783 and 9999</code>`) : year;
  const calendarResult = calendar(year).replace(/ /g, "&nbsp;").split("\n").join("<br>");
  res.status(200).send(`
    <head>
      <title>Calendar for ${year}</title>
      <link rel="stylesheet" type="text/css" href="style.css">
    </head>
    <code>${calendarResult}</code>`)
});

// able to use router with this function
// app.use(router);

// calendar result for today
router.get('/cal', (req, res) => {
  const date = new Date;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const days = wholeMonth(year, month).replace(/ /g, "&nbsp;").split("\n").join("<br>");
  res.status(200).send(`
    <head>
      <title>Calendar for ${month} ${year}</title>
      <link rel="stylesheet" type="text/css" href="style.css">
    </head>
    <code>${days}</code>`);
});

module.exports = router;
