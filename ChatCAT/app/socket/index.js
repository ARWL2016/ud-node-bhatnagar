'use strict'; 
const h = require('../helpers'); 

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;

  // listen to roomslist pipeline on sockets connection
  io.of('/roomslist').on('connection', socket => {
    console.log('Socket.io connected to client'); 
    socket.on('getChatrooms', () => {
      socket.emit('chatRoomsList', JSON.stringify(allrooms)); 
    });

    socket.on('createNewRoom', (newRoomInput) => {

      if(!h.findRoomByName(allrooms, newRoomInput)) {
        allrooms.push({
          room: newRoomInput, 
          roomID: h.randomHex(), 
          users: []
        }); 

        // emit an updated list to the creator 
        // socket.emit ONLY emits back to the active socket
        socket.emit('chatRoomsList', JSON.stringify(allrooms)); 
        // send to everyone 
        socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms)); 
      }
    });
  }); 

  // Join a chatroom
  io.of('/chatter').on('connection', socket => {
    socket.on('join', data => {
      let usersList = h.addUserToRoom(allrooms, data, socket); 
       
      socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users)); 
      socket.emit('updateUsersList', JSON.stringify(usersList.users)); 
    });

    // When a socket exits
    socket.on('disconnect', () => {
      let room = h.removeUserFromRoom(allrooms, socket); 
      socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users)); 
    }); 

    //When a new message arrives
    socket.on('newMessage', data => {
      // socket.to === socket.broadcast.to
      socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
    });
  }); 
}