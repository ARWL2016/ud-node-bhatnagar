'use strict'; 

if (process.env.NODE_ENV === 'production') {
  // prod env variables 
  module.exports = {
    host: process.env.host || "", 
    dbURI: process.env.dbURI, 
    sessionSecret: process.env.sessionSecret
  }
} else {
  // dev settings 
  module.exports = require('./development.json'); 
}

// .json file does not need to be exported? 