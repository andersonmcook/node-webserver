'use strict';

const express = require('express');
const router = express.Router();
const Image = require('../models/image');
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp/uploads');
    },
    filename: function (req, file, cb) {
       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
})
const upload = multer({ storage: storage });


// upload a file
router.get('/send-photo', (req, res) => {
  res.render('sendphoto');
});

// return the file
router.post('/send-photo', upload.single('image'), (req, res) => {
  console.log(req.body, req.file);
  imgur.uploadFile(req.file.path)
    .then(function (json) {
        console.log(json.data.link);
        const obj = new Image({url: json.data.link});
        obj.save((err, _obj) => {
          if (err) throw err;
        });
        // db.collection('images').insertOne({"url": json.data.link});
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

module.exports = router;
