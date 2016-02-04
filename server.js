'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const path = require('path');
const nodeSassMiddleware = require('node-sass-middleware');
// const execSync = require('child_process').execSync;
const wholeMonth = require('node-cal/lib/month').wholeMonth;
const calendar = require('node-cal/lib/year').calendar;

// set view engine to a file ending with .jade in the views folder by default
app.set('view engine', 'jade');

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

const backButton = `<a class="back" href="http://localhost:3000/">Back</a>`;
const title = `.cal.js`;

// set global title
app.locals.title = 'THE Super Cool App';

//contact.jade
app.get('/contact', (req, res) => {
  res.render('contact');
});

// using jade to render
app.get('/jade', (req, res) => {
  res.render('index');
});

// hello world page
app.get('/hello', (req, res) => {
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
      <link rel="stylesheet" type="text/css" href="http://localhost:3000/style.css">
    </head>
    ${backButton}
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
      <link rel="stylesheet" type="text/css" href="http://localhost:3000/style.css">
    </head>
    ${backButton}
    <code>${calendarResult}</code>`)
});

// able to use router with this function
app.use(router);

// calendar result for today
app.get('/cal', (req, res) => {
  const date = new Date;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const days = wholeMonth(year, month).replace(/ /g, "&nbsp;").split("\n").join("<br>");
  res.status(200).send(`
    <head>
      <title>Calendar for ${month} ${year}</title>
      <link rel="stylesheet" type="text/css" href="http://localhost:3000/style.css">
    </head>
    ${backButton}
    <code>${days}`);
});

// random num gen page
app.get('/random', (req, res) => {
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
app.get('/secret', (req, res) => {
  res
    .status(403)
    .send(403, `${backButton}
      <h1>Access Denied</h1>`);
});

// main page with links to other pages
app.get('/', (req, res) => {
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

// listen for requests
app.listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
