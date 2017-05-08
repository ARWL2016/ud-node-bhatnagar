'use strict'; 

// OAuth Logic 
require('./auth')(); 

// Create an IO Server instance built on a raw node server
let ioServer = (app) => {
  app.locals.chatrooms = []; // stored in memory
  const server = require('http').Server(app); 
  const io = require('socket.io')(server);
  // get the request data from the express session
  io.use((socket, next) => {
    require('./session')(socket.request, socket.request.res, next); 
  }); 
  require('./socket')(io, app); 
  return server; 
}

module.exports = { 
  router: require('./routes')(), 
  session: require('./session'), 
  ioServer
}; 