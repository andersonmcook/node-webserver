'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const execSync = require('child_process').execSync;
const wholeMonth = require('node-cal/lib/month').wholeMonth;
const _ = require('lodash');

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

// calendar
router.get('/cal/:month/:year', (req, res) => {
  const month = req.params.month;
  const year = req.params.year;
  console.log("year", year, "month", month);
  // const result = execSync(wholeMonth(year, month));
  // res.send(`${wholeMonth(year, month)}`);
  // res.send(result);
  const days = wholeMonth(year, month).replace(/ /g, "&nbsp;").split("\n");
  console.log("days", days);
  const p = "<p style='font-family: monospace;'>"
  res.status(200).send(`${p}${days[0]}</p>${p}${days[1]}</p>${p}${days[2]}</p>${p}${days[3]}</p>${p}${days[4]}</p>`);
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
