//Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String
});

//Return Model
module.exports = restful.model('Users', userSchema);
