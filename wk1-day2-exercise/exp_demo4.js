var express = require('express');
var app = express();

app.get('/home', function(req, res) {
    res.send("Home Page");
});

app.get('/about', function(req, res) {
    res.send("About");
});

app.listen(3000, function() {
    console.log('Server running on port 3000');
});