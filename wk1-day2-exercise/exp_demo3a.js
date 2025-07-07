const express = require('express');
const router = express.Router();

router.get('/home', function(req, res) {
    res.send("Hello World!");
});

router.post('/home', function(req, res) {
    res.send("You just called the POST method at '/home'!\n");
});

module.exports = router;
