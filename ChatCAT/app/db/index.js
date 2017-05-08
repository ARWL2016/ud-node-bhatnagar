'use strict'; 

// Connect to Mongo using the config sessions, log errors and export

const config = require('../config'); 
const logger = require('../logger'); 
const Mongoose = require('mongoose').connect(config.dbURI); 

Mongoose.connection.on('error', error => {
  logger.log('error', "Mongoose connection error: " + error); 
});

const chatUser = new Mongoose.Schema({
  profileId: String, 
  fullName: String, 
  profilePic: String 
}); 

// Mongoose will automatically create a collection called chatUsers
let userModel = Mongoose.model('chatUser', chatUser); 

module.exports = {
  Mongoose, 
  userModel
}