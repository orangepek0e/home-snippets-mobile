//Dependencies
var express = require('express');
var router = express.Router();

//Models
var Users = require('../models/users');

//Routes
Users.methods(['get', 'put', 'post', 'delete']);
Users.register(router, '/users');


//Return Router
module.exports = router;
