'use strict'; 

// const router = require('express').Router(); 
const db = require('../db'); 

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

module.exports = {

  findOne,
  findById,
  createNewUser
}