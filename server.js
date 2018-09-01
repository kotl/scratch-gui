var express = require('express');
var path = require('path');
var open = require('open');
const app = express();
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

const isDev = process.env.ISDEV;

var session = require("express-session"),
bodyParser = require("body-parser");

app.use(express.static('build'));
app.use(session({}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});


passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

const port = (isDev === 'YES') ? 3000 : 80;

app.listen(port, function (error) {
    if(error) {
        console.log(error);
    } else {
        if (isDev === 'YES') {
            console.log("SERVER STARTED in DEV mode");
            setTimeout(
            () => {
                open(`http://localhost:${port}`)   
            }            
            , 60000);
        } else {
            console.log("SERVER STARTED in PRODUCTION mode");            
        }
    }
});

