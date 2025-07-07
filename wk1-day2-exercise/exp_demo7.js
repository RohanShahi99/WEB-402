var express = require('express');
var app = express();

app.use(function(req, res, next) {
    console.log("A New Request Received at " + Date.now());
    next();
});    


app.get('/home', function(req, res) {
    res.send('Home Page');
});

app.get('/about', function(req, res) {
    res.send('About');
});


app.listen(3000, function() {
    console.log('Server started on port 3000');
});

