//Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//MongoDB
mongoose.connect('mongodb://localhost/gamrsApi');

//Express
var app = express();
app.use(bodyParser.urlencoded({extended:true }));
app.use(bodyParser.json());

//Routes
app.use('/api', require('./routes/api'));

//Start Server
app.listen(1337);
console.log('API is running on port 1337');
