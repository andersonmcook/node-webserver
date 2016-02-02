'use strict';

const app = require('express')();
const PORT = process.env.PORT || 3000;

// hello world page
app.get('/hello', (req, res) => {
  const msg = "<h1>Hello Smithers, you're quite good at turning me on.</h1>";
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

// random num gen page
app.get('/random', (req, res) => {
  res.end(`<h1>${Math.random()}</h1>`);
});

// 404 page
app.all('*', (req, res) => {
  res.writeHead(403);
  res.end(`<h1>Access Denied</h1>`)
});

// listen for requests
app.listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
