'use strict'; 

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;

  

  // listen to roomslist pipeline on sockets connection
  io.of('/roomslist').on('connection', socket => {
    console.log('Socket.io connected to client'); 
    socket.on('getChatrooms', () => {
      socket.emit('chatRoomsList', JSON.stringify(allrooms)); 
    });

    socket.on('createNewRoom', (newRoomInput) => {

      if(!h.findRoomByName(allrooms, newroomInput)) {
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
}