'use strict'; 

const winston = require('winston'); 
const logger = new (winston.Logger)({
  transport: [
    new (winston.transports.File)({
      level: 'debug', 
      filename: './chatCatDebug.log', 
      handleExceptions: true
    }), 
    new (winston.transports.Console)({
      level: 'debug', 
      json: true, 
      handleExceptions: true
    })
  ],
  // logging will not exit on exception
  exitOnError: false
});

module.exports = logger; 