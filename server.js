'use strict';

const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  console.log(req.method, req.url);

  if(req.url === "/hello") {
    const msg = "<h1>Hello World!</h1>";
    msg.split("").forEach((char, i) => {
      setTimeout(() => {
        res.write(char);
      }, 1000 * i);
    });
    setTimeout(() => {
      res.end();
    }, 20000);

  } else if (req.url === "/random") {
    res.end(`<h1>${Math.random()}</h1>`)
  } else {
    res.writeHead(403);
    res.end(`<h1>Access Denied</h1>`)
  }
  res.writeHead(200, {"Content-Type": "text/html"});
}).listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
