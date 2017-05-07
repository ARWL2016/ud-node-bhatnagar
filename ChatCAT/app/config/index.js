'use strict'; 

if (process.env.NODE_ENV === 'production') {
  // prod env variables 
  module.exports = {
    host: process.env.host || "", 
    dbURI: process.env.dbURI, 
    sessionSecret: process.env.sessionSecret,
    fb: {
      clientID: process.env.fbClientID, 
      clientSecret: process.env.fbClientSecret, 
      callbackURL: process.env.host + "/auth/facebook/callback", 
      profileFields: ['id', 'displayName', 'photos']
    }, 
    twitter: {
      consumerKey: process.env.twConsumerKey, 
      consumerSecret: process.env.twitterConsumerSecret, 
      callbackURL: process.env.host + "/auth/twitter/callback", 
      profileFields: ['id', 'displayName', 'photos']
    }
  };
} else {
  // dev settings 
  module.exports = require('./development.json'); 
}

// .json file does not need to be exported? 