'use strict'
const express = require('express'); 
const app = express(); 
const chatCat = require('./app'); 
const passport = require('passport'); 
const routes = require('./app/routes/routes');

app.set('port', process.env.PORT || 3000); 
app.use(express.static('public')); 
app.set('view engine', 'ejs'); 

app.use(chatCat.session); 
app.use(passport.initialize()); 
// connect passport to the express session
app.use(passport.session()); 

routes(app); 

app.listen(app.get('port'), () => {
  console.log('ChatCAT Running on Port ' + app.get('port')); 
})