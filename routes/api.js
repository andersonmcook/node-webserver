'use strict';

const express = require('express');
const router = express.Router();
const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');
// const Image = require('../models/image');
const News = require('../models/news');
// const Contact = require('../models/contact');
const Allcaps = require('../models/allcaps');




// send json object
router.get('/api', (req, res) => {
// set header for cors
  res.header('Access-Control-Allow-Origin', '*');
  res.send({hello: 'world'});
});

// post json object with Postman and set values to upper case
router.post('/api', (req, res) => {
  const obj = _.mapValues(req.body, val => val.toUpperCase());
  const AC = new Allcaps(obj);
  AC.save((err, _AC) =>{
  // db.collection('allcaps').insertOne(obj, (err, result) => {
    if (err) throw err;
    console.log(_AC);
    res.send(_AC);
  });
});

// change all reddit links to rick rolls
router.get('/api/reddit', (req, res) => {
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
router.get('/api/news', (req, res) => {
// grab latest news from database
  News.findOne().sort('-_id').exec((err, doc) => {
  // db.collection('news').findOne({}, {sort: {_id: -1}}, (err, doc) => {
    console.log(doc._id.getTimestamp())
// if doc exists and is less than 15 minutes old, return from db
    if (doc) {
      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
      const lessThan15MinutesAgo = diff < 0;

      if (lessThan15MinutesAgo) {
        res.send(doc);
        return;
      }
    }
// end if doc exists

// use cheerio to webscrape and loop over dom elements
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

      _.range(1, 12).forEach(i => {
        const $headline = $cdHeadline.eq(i);

        news.push({
          title: $headline.text(),
          url: url + $headline.find('a').attr('href')
        });
      });
// save to db with mongoose
      const obj = new News({top: news});

      obj.save((err, _news) => {
      // db.collection('news').insertOne({ top: news }, (err, result) => {
        if (err) throw err;

        res.send(_news);
      });
    });
  });
});

// using request module
router.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/4bf87414e256897cac4a0724afcda091/37.8267,-122.423';
  request.get(url, (err, response, body) => {
    if (err) throw err;
    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

// get top headline
router.get('/api/news/topheadline', (req, res) => {
    News.findOne().sort('-_id').exec((err, doc) => {
  // db.collection('news').findOne({}, {sort: {_id: -1}}, (err, doc) => {
    const topStory = doc && doc.top && doc.top[0] || '';
    if (err) throw err;
    res.send(`<h1>${topStory.title}</h1><a href="${topStory.url}">${topStory.url}</a>`);
  });
});



module.exports = router;

