const passport = require('passport'); 
const config = require('../config'); 
const h = require('../helpers'); 
const FacebookStrategy = require('passport-facebook').Strategy; 

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); 
  })
  passport.deserializeUser((id, done) => {
    h.findById(id)
      .then(user => done(null, user))
      .catch(error => console.log('Error when deserializing user'));
  })

  let authProcessor = (accessToken, refreshToken, profile, done) => {
      // Find a user in local db using profile.id and return the data, or create user, and call done
      h.findOne(profile.id)
          .then(result => {
            if (result) {
              done(null, result);
            } else {
              h.createNewUser(profile)
                  .then(newChatUser => done(null, newChatUser))
                  .catch(error => console.log('Error when creating new user'));
            }
          });
  };

  passport.use(new FacebookStrategy(config.fb, authProcessor)); 
}