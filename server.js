'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const execSync = require('child_process').execSync;
const wholeMonth = require('node-cal/lib/month').wholeMonth;
const calendar = require('node-cal/lib/year').calendar;

// hello world page
app.get('/hello', (req, res) => {
  const name = req.query.name;
  const msg = `<h1>Hello ${name}!</h1>
<h1>Goodbye ${name}!</h1>`;
  res.writeHead(200, {"Content-Type": "text/html"});
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


router.get('/random/:min/:max', (req, res) => {
  const min = req.params.min;
  const max = req.params.max;
  res.send(`<h1>${parseInt(Math.random() * (max - min) + min)}</h1>`);
});

// month calendar
router.get('/cal/:month/:year', (req, res) => {
  const month = parseInt(req.params.month);
  const year = parseInt(req.params.year);
  month < 1 || month > 12 ? res.status(200).send(`<code>Pick a month between 1 and 12</code`) : month;
  year > 9999 || year < 1783 ? res.status(200).send(`<code>Pick a year between 1783 and 9999</code>`) : year;
  const days = wholeMonth(year, month).replace(/ /g, "&nbsp;").split("\n").join("<br>");
  res.status(200).send(`<code>${days}</code>`);
});

//year calendar
router.get('/cal/:year', (req, res) => {
  const year = parseInt(req.params.year);
  year > 9999 || year < 1783 ? res.status(200).send(`<code>Pick a year between 1783 and 9999</code>`) : year;
  const calendarResult = calendar(year).replace(/ /g, "&nbsp;").split("\n").join("<br>");
  res.status(200).send(`<code>${calendarResult}</code>`)
});

app.use(router);

app.get('/cal', (req, res) => {
  // // console.log(month);
  // // res.send(`${month}`);
  // const test = execSync(wholeMonth(2016, 1)).toString();
  // // console.log(test);
  // res.send(`${wholeMonth(2016, 1)}`);
  // // res.send(`${test}`);
});

// random num gen page
app.get('/random', (req, res) => {
  res
    .status(200)
    .send(`<h1>${Math.random()}</h1>`);
});

// 403 page
app.get('/secret', (req, res) => {
  res
    .status(403)
    .send(403, `<h1>Access Denied</h1>`);
});

// listen for requests
app.listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
