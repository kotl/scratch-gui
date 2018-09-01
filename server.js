var express = require('express');
var path = require('path');
var open = require('open');
var db = require('./db');
var passwordHash = require('password-hash');

const User = db.User;
const ScratchProject = db.ScratchProject;

const app = express();
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

const isDev = process.env.ISDEV;

var session = require("express-session"),
bodyParser = require("body-parser");

app.use(express.static('build'));
app.use(session({ secret: 'csfirst-offline' }));
app.use(bodyParser.json());
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
        if (err) {
            console.log("Can not find user:" + err); 
            return done(err); 
        }
        if (!user) {
            var hashedPassword = passwordHash.generate(password, { });    
            User.create({ username, password: hashedPassword }, function (err, user) {
                if (err) {
                  return done(err)
                } else {
                    return done(null, user);
                }
              });            
        } else {
          if (!passwordHash.verify(password, user.password))  {
             return done(null, false, { message: 'Incorrect password.' });
          }

         return done(null, user);
        }
      });
    }
  ));

app.post('/api/login', 
  passport.authenticate('local', { }),
  function(req, res) {
    res.send('AUTHENTICATED');
  });

app.post('/api/save', 
  passport.authenticate('local', { failureRedirect: '/api/login' }),
  function(req, res) {
    console.log("Saving: "+ req);
    res.send('NOPE');
  });

app.post('/api/load', 
  passport.authenticate('local', { failureRedirect: '/api/login' }),
  function(req, res) {
    console.log("Loading: "+ req);
    res.send('NOPE');
});

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

