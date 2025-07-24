const http = require('http');

const port = 5000;

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url;
  console.log(`Request received for: ${url}`);
  res.setHeader('Content-Type', 'text/html');

  if (url === '/' || url === '/home') {
    res.write('<h1 style="color: green;">Welcome to Home Page</h1><p>This is the home page.</p>');
  } else if (url === '/about') {
    res.write('<h1 style="color: blue;">About Us</h1><p>This is the about page.</p>');
  } else if (url === '/contact') {
    res.write('<h1 style="color: orange;">Contact Us</h1><p>This is the contact page.</p>');
  } else {
    res.write('<h1 style="color: red;">Invalid Request!</h1>');
  }

  res.end();
});

server.listen(port, () => {
  console.log(`The NodeJS server on port ${port} is now running….`);
});
