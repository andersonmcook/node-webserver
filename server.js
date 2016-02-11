'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const path = require('path');
const nodeSassMiddleware = require('node-sass-middleware');
const bodyParser = require('body-parser');
//const upload = require('multer')({dest: 'tmp/uploads'});
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');
const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');
const MongoClient = require('mongodb').MongoClient;
const MONGODB_URL = 'mongodb://localhost:27017/node-webserver';
// const execSync = require('child_process').execSync;
const wholeMonth = require('node-cal/lib/month').wholeMonth;
const calendar = require('node-cal/lib/year').calendar;

// rename files that have been uploaded
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp/uploads');
    },
    filename: function (req, file, cb) {
       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
})
const upload = multer({ storage: storage });

// set view engine to a file ending with .jade in the views folder by default
app.set('view engine', 'jade');


// body-parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

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

// send json object
app.get('/api', (req, res) => {
// set header for cors
  res.header('Access-Control-Allow-Origin', '*');
  res.send({hello: 'world'});
});

// post json object
app.post('/api', (req, res) => {
  console.log(req.body);
  const obj = _.mapValues(req.body, val => val.toUpperCase());
  res.send(obj);
});

// change all reddit links to rick rolls
app.get('/api/reddit', (req, res) => {
  const url = 'https://www.reddit.com';
  request.get(url, (err, response, html) => {
    if (err) throw err;
    const $ = cheerio.load(html);
    const $a = $('.title.may-blank');
    _.range(0, $a.length).forEach(i => {
      $a.eq(i).attr('href', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });
  res.send($.html());
  });
});

// webscraping with cheerio
app.get('/api/news', (req, res) => {
  const url = 'http://cnn.com';
  request.get(url, (err, response, html) => {
    if (err) throw err;
    const news = [];
    const $ = cheerio.load(html);
    const $bannerText = $('.banner-text');

    news.push({
      title: $bannerText.text(),
      url: url + $bannerText.closest('a').attr('href')
    });

    const $cdHeadline = $('.cd__headline');
// caching selectors to prevent performance hit(mainly important for front end)
    _.range(1, 12).forEach(i => {
        const $headline = $cdHeadline.eq(i);

        //let linkUrl = $($('.cd__headline a')[i]).attr('href');

        //if (linkUrl.split("")[0] === "/") {
          //linkUrl = "http://www.cnn.com" + linkUrl;
        //}

        news.push({
          title: $headline.text(),
          url: url + $headline.find('a').attr('href')
        });
    });

    res.send(news);
  });
});

// using request module
app.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/4bf87414e256897cac4a0724afcda091/37.8267,-122.423';
  request.get(url, (err, response, body) => {
    if (err) throw err;
    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

// contact.jade
app.get('/contact', (req, res) => {
  res.render('contact');
});

// post
app.post('/contact', (req, res) => {
  const name = req.body.name
  res.send(`<h1>Thanks for contacting us, ${name}</h1`);
});

// upload a file
app.get('/send-photo', (req, res) => {
  res.render('sendphoto');
});

// return the file
app.post('/send-photo', upload.single('image'), (req, res) => {
  console.log(req.body, req.file);
  imgur.uploadFile(req.file.path)
    .then(function (json) {
        console.log(json.data.link);
        res.send(`<h1>Thanks for uploading a pic</h1>
                <img src="${json.data.link}">`);
        fs.unlink(req.file.path, () => {
          console.log("file deleted");
        });
    })
    .catch(function (err) {
        console.error(err.message);
        res.write(err.message);
    });
  /*res.send(`<h1>Thanks for sending us your photo</h1>`);*/
});

// using jade to render index.jade
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

// mongodb
  // Use connect method to connect to the Server
MongoClient.connect(MONGODB_URL, function(err, db) {
  if (err) throw err;
  console.log("Connected correctly to server");

  db.collection('docs').insertMany([{a : 'b'}, {c : 'd'}, {e : 'f'}], (err, res) => {
    if (err) throw err;
    console.log(res);
  });

// listen for requests
  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}`);
  });

});

