'use strict'; 

const config = require('./config'); 
const redis = require('redis').createClient; 
const adapter = require('socket.io-redis'); 

// OAuth Logic 
require('./auth')(); 

// Create an IO Server instance built on a raw node server
let ioServer = (app) => {
  app.locals.chatrooms = []; // stored in memory
  const server = require('http').Server(app); 
  const io = require('socket.io')(server);
  // configure sockets to only use websockets (not long polling)
  io.set('transports', ['websocket']); 
  let pubClient = redis(config.redis.port, config.redis.host, {
    auth_pass: config.redis.password
  });
  // get data from redis 
  let subClient = redis(config.redis.port, config.redis.host, {
    return_buffers: true, 
    auth_pass: config.redis.password
  }); 
  io.adapter(adapter({
    pubClient, 
    subClient
  }));
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