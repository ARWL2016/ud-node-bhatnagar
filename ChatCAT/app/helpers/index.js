'use strict'; 

const router = require('express').Router(); 
const db = require('../db'); 
const crypto = require('crypto'); 

 // Iterate through the routes object and mount the routes
  let _registerRoutes = (routes, method) => {
    for (let key in routes) {
      // Validate the structure of the routes object, the call the function again (recursively) 
      if (typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
        _registerRoutes(routes[key], key); 
      } else {
        // Register the routes 
        if (method === 'get') {
          router.get(key, routes[key]); 
        } else if (method === 'post') {
          router.post(key, routes[key]); 
        } else {
          // default path - must come last 
          router.use(routes[key]); 
        }
      }
    }
  } // registerRoutes 

let route = (routes) => {
  _registerRoutes(routes);
  return router; 
}

// Find a single user from a key 
let findOne = (profileID) => {
  return db.userModel.findOne({
    'profileId': profileID
  }); 
}

// Create a new user and return that instance 
let createNewUser = (profile) => {
  return new Promise((resolve, reject) => {
    let newChatUser = new db.userModel({
      profileId: profile.id, 
      fullName: profile.displayName, 
      profilePic: profile.photos[0].value || ''
    })

    newChatUser.save(error => {
      if (error) {
        reject(error); 
      } else {
        resolve(newChatUser); 
      }
    });
  });
}

// findById wrapped in an ES6 promise
let findById = (id) => {
  return new Promise((resolve, reject) => {
    db.userModel.findById(id, (error, user) => {
      if (error) {
        reject(error); 
      } else {
        resolve(user); 
      }
    });
  });
}

let isAuthenticated = (req, res, next) => {
  // call passport func 
  if (req.isAuthenticated()) {
    next(); 
  } else {
    res.redirect('/'); 
  }
}

// Find a chatroom by a given name 
let findRoomByName = (allrooms, room) => {
  let findRoom = allrooms.findIndex((el, ind, arr) => {
    if (element.room === room) {
      return true; 
    } else {
      return false; 
    }
  }); 
  return findRoom > -1 ? true : false; 
}

// Generate a unique room ID 
let randomHex = () => {
  return crypto.randomBytes(24).toString('hex'); 
}

let findRoomById = (allrooms, roomID) => {
  return allrooms.find((element, index, array) => {
    if(element.roomID === roomID) {
      return true 
    } else {
      return false; 
    }
  }); 
}

let addUserToRoom = (allrooms, data, socket) => {
  let getRoom = findRoomById(allrooms, data.roomID); 
  if(getRoom !== undefined) {
    // Get the active user's ID (session ObjectID)
    // Made possible by the bridge between sockets and express session
    let userID = socket.request.session.passport.user; 
    // Does user exist in the chatroom
    let checkUser = getRoom.users.findIndex((el, ind, arr) => {
      if(el.userID === userID) {
        return true; 
      } else {
        return false; 
      }
    }); 

    // remove user 
    if(checkUser > -1) {
      getRoom.users.splice(checkUser, 1); 
    }

    // add user 
    getRoom.users.push({
      socketID: socket.id, 
      userID, 
      user: data.user, 
      userPic: data.userPic
    });

    // Join the room channel 
    socket.join(data.roomID); 

    // return the updated room object 
    return getRoom; 
  }
}

let removeUserFromRoom = (allrooms, socket) => {
  for (let room of allrooms) {
    let findUser = room.users.findIndex((el, ind, arr) => {
      if (el.socketID === socket.id) {
        return true; 
      } else {
        return false 
      }
      // return element.socketID === socket.id ? true : false; 
    });

    if(findUser > -1) {
      socket.leave(room.roomID); 
      room.users.splice(findUser, 1); 
      return room; 
    }
  }
}

module.exports = {
  route, 
  findOne,
  findById,
  createNewUser, 
  isAuthenticated, 
  findRoomByName, 
  randomHex, 
  findRoomById, 
  addUserToRoom,
  removeUserFromRoom
}