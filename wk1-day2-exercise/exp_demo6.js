var express = require('express');
var app = express();

app.get('/home', function(req, res) {
    res.send('Home Page');
});

app.get('/about', function(req, res) {
    res.send('About');
});


app.use(function(req, res) {
    res.status(404).send('404! This is an invalid URL');
});

var PORT = 3000;
app.listen(PORT, function() {
    console.log('Server running on http://localhost:' + PORT);
});

