'use strict'; 

// Connect to Mongo using the config sessions, log errors and export

const config = require('../config'); 
const Mongoose = require('mongoose').connect(config.dbURI); 

Mongoose.connection.on('error', error => {
  console.log("MongoDB Error: ", error); 
});

module.exports = {
  Mongoose
}