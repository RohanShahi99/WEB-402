const http = require('http');

const port = 5001;

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  console.log(`Request received for: ${req.url}`);

  res.setHeader('Content-Type', 'text/html');

  if (req.url === '/' || req.url === '/home') {
    res.write('<h1>Home Page.</h1>');
  } else if (req.url === '/about') {
    res.write('<h1>About Page.</h1>');
  } else if (req.url === '/contact') {
    res.write('<h1>Contact Page.</h1>');
  } else {
    res.write('<h1>Invalid Request!</h1>');
  }

  res.end();
});

server.listen(port, () => {
  console.log(`The NodeJS server on port ${port} is now running….`);
});
