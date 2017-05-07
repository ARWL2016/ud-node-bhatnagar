const passport = require('passport'); 

module.exports = (app) => {

    app.get('/', (req, res) => {
      res.render('login'); 
    });

    app.get('/rooms', (req, res) => {
      res.render('rooms', {
        user: req.user
      });
    });

    app.get('/chat', (req, res) => {
      res.render('chatroom'); 
    });

    app.get('/auth/facebook', passport.authenticate('facebook')); 

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/rooms', 
        failureRedirect: '/'
    })); 

    app.get('NA', (req, res) => {
      res.status(404).sendFile(process.cwd() + '/views/404.htm');
    }); 

}

 
