const express = require('express');
const app = express();


const routedemo = require('./exp_demo3a.js');

app.use('/routedemo', routedemo);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});