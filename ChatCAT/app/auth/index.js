const passport = require('passport'); 
const config = require('../config'); 
const h = require('../helpers'); 
const FacebookStrategy = require('passport-facebook').Strategy; 
const TwitterStrategy = require('passport-twitter').Strategy; 

module.exports = () => {
  // when passport authenticates the user, it will call this function 
  // this creates a session with the user.id (the unique id key assigned by Mongo)
  // since sessions use cookies, we don't want to store all our data in one
  passport.serializeUser((user, done) => {
    console.log('serialize', user);
    done(null, user.id); 
  })
  // use that serialized id to recover use data 
  // this will make the id available in req.user (the request stream)
  passport.deserializeUser((id, done) => {
    console.log('deserialize', id);
    h.findById(id)
      .then(user => done(null, user))
      .catch(error => console.log('Error when deserializing user'));
  })

  let authProcessor = (accessToken, refreshToken, profile, done) => {
      // Find a user in local db using profile.id and return the data, or create user, and call done
      console.log('authProcessor', accessToken, profile); 
      h.findOne(profile.id)
          .then(result => {
            if (result) {
              // done returns the result from passport to our app
              done(null, result);
            } else {
              // Create a new user and return 
              h.createNewUser(profile)
                  .then(newChatUser => done(null, newChatUser))
                  .catch(error => console.log('Error when creating new user'));
            }
          })
  }

  passport.use(new FacebookStrategy(config.fb, authProcessor)); 
  passport.use(new TwitterStrategy(config.twitter, authProcessor));
}