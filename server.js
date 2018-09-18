var express = require('express');
var path = require('path');
var open = require('open');
var fs = require('fs');
var passwordHash = require('password-hash');
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

var db = require('./db');

const User = db.User;
const ScratchProject = db.ScratchProject;

const app = express();

const isDev = process.env.ISDEV;

var session = require("express-session"),
bodyParser = require("body-parser");

app.use(express.static('build'));
app.use('/projects', express.static('projects'));
app.use('/assets', express.static('assets'));
app.use(session({ secret: 'csfirst-offline' }));
app.use(bodyParser.raw({ inflate: true, limit: '100000kb', type: 'application/zip' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
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

function projectMap(projects) {
  return projects.reduce(function (o, v) {
     o[v.projectId] = v;
     return o
    }, {})
}

function saveUserProjects(req, res, pm, id, done) {
    req.user.projects = Object.keys(pm).map(id => pm[id]);
    req.user.save((err) => {
      if (!err) {
        res.send({ id: id, result: 'OK' });
      } else {
        done('Can not convert list of projects');
      }
    });
}

app.post('/api/save', 
  function(req, res, done) {
    if (!req.user) {
      return done('User not found');
    }
    let id = req.query.id;
    const title = req.query.title ? req.query.title : 'Untitled';
    const data = req.body;
    const pm = projectMap(req.user.projects);
    if (!id || !pm[id]) {
      console.log("Id or project not found");
      ScratchProject.create(
        {owner: req.user.username, data: data},
        (err, project) => {
          if (err) {
            return done('Can not create project');
          }
            id = String(project._id);
            pm[id] = {
              title: title,
              projectId: id,
            }
            console.log("New id created:" + id);
            return saveUserProjects(req,res,pm, id, done);
        }
      );
    } else {
      console.log("Id already exists");
      pm[id].title = title;
      ScratchProject.findById(id, (err, project) => {
        if (err) {
          return next('Can not find project by id');
        }
        project.data = data;
        project.save((err) => {
        if (err) {
          return done('Can not save project');
        }
        return saveUserProjects(req,res,pm, id, done);
      });

      });
    }
  });

app.post('/api/load', 
  function(req, res, done) {
    if (!req.user) {
      return done('User not found');
    }
    const id = req.query.id;
    ScratchProject.findById(id, (err, project) => {
        if (err) {
          return next('Can not find project by id');
        }
        if (project.owner == req.user.username) {
          res.contentType("application/zip");
          res.send(project.data);
        } else {
          done('Wrong owner');
        }
    });
});

app.get('/api/template/:id', 
  function(req, res, done) {
    const id = req.params.id;
    const path = id + "/index.sb2";
    res.contentType("application/zip");
    let nameContent = fs.readFileSync('projects/' + id + '/name.txt', 'utf8'); 
    console.log("Name content:" + nameContent);
    res.header('project-title', nameContent.replace('\r','').replace('\n',''));
    res.sendfile(path, {root: './projects'});
});

app.post('/api/list', 
  function(req, res) {
    res.send({ projects: req.user.projects, result: 'OK'});
});

const port = (isDev === 'YES') ? 3000 : 3000;

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

