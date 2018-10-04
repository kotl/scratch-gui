var express = require('express');
var path = require('path');
var open = require('open');
var fs = require('fs');
var querystring = require('querystring');

var projectsPath = '../projects/';

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
app.use('/assets', express.static('assets'));
app.use(session({ secret: 'csfirst-offline' }));
app.use(bodyParser.raw({ inflate: true, limit: '100000kb', type: 'application/zip' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err));
});

var regexUsername = /^[a-zA-Z]\w+$/;

function userFound(req, user, username, password, done) {
    if (!user) {
        var hashedPassword = passwordHash.generate(password, {});
        if (username.length < 4 || password.length < 4) {
            req.autherror = 'Username / password must contain at least 4 letters.';
            return done(null, false);
        }
        if (!username.match(regexUsername)) {
            req.autherror = 'Username must contain only alpha numeric characters and start with a letter';
            return done(null, false);
        }
        return User.create({ username, password: hashedPassword })
            .then((user) => done(null, Object.assign(user, { created: true })))
            .catch((err) => done(err));
    } else {
        if (!passwordHash.verify(password, user.password)) {
            req.autherror = 'Incorrect password';
            return done(null, false);
        }
        return done(null, user);
    }
}

passport.use(new LocalStrategy({passReqToCallback: true},
    function (req, username, password, done) {
        User.findOne({ where: { username: username } })
            .then((user) => userFound(req, user, username, password, done))
            .catch((err) => {
                req.autherror = 'Can not find user';
                return done(null, false);
            });
    }
));

app.post('/api/login',
    passport.authenticate('local', { failWithError: true }),
    function (req, res) {
        var username = req.user.username;
        var created = (typeof (req.user.created) != 'undefined' && req.user.created == true);
        res.send({ result: 'AUTHENTICATED', user: username, created: created });
    },
    function(err, req, res, next) {
        if (err.name === 'AuthenticationError' && req.autherror) {
            res.status(401).send(req.autherror);
        }
      }
    );

function projectMap(projects) {
    return projects.reduce(function (o, v) {
        o[v.projectId] = v;
        return o
    }, {})
}

function saveUserProjects(req, res, pm, id, done) {
    req.user.projects = Object.keys(pm).map(id => pm[id]);
    req.user.save({})
        .then((validationError) => {
            if (typeof (validationError.errors) == 'undefined') {
                res.send({ id: id, result: 'OK' });
            } else {
                done(validationError.errors);
            }
        }
        )
        .catch((err) =>
            done('Can not convert list of projects')
        );
}

function createNewProject(req, res, pm, title, done) {
    console.log("Id or project not found");
    return ScratchProject.create({ owner: req.user.username, data: req.body })
        .then((project) => {
            let id = project.projectId;
            pm[id] = {
                title: title,
                projectId: id,
            }
            console.log("New id created:" + id);
            return saveUserProjects(req, res, pm, id, done);
        })
        .catch((err) => done('Can not create project'));
}

function updateExistingProject(req, res, pm, title, id, done) {
    console.log("Id already exists");
    pm[id].title = title;
    ScratchProject.findById(id)
        .then((project) => {
            project.data = req.body;
            project.save({})
                .then((validationError) => {
                    if (typeof (validationError.errors) == 'undefined') {
                        return saveUserProjects(req, res, pm, id, done);
                    }
                    return done(validationError.errors);
                }
                ).catch((err) => done('Can not save project'));
        })
        .catch((err) => {
            console.log(err);
            return done('Can not find project by id');
        });
}

app.post('/api/save',
    function (req, res, done) {
        if (!req.user) {
            return done('User not found');
        }
        let id = req.query.id;
        const title = req.query.title ? req.query.title : 'Untitled';
        const pm = projectMap(req.user.projects);
        if (!id || !pm[id]) {
            return createNewProject(req, res, pm, title, done);
        } else {
            return updateExistingProject(req, res, pm, title, id, done);
        }
    });

app.post('/api/load',
    function (req, res, done) {
        if (!req.user) {
            return done('User not found');
        }
        const id = req.query.id;
        ScratchProject.findById(id)
            .then((project) => {
                if (project.owner == req.user.username) {
                    res.contentType("application/zip");
                    res.send(project.data);
                } else {
                    done('Wrong owner');
                }
            })
            .catch((err) => done('Can not find project by id'));
    });

app.get('/api/template/:id',
    function (req, res, done) {
        const id = req.params.id;
        const path = id + "/index.sb2";
        res.contentType("application/zip");
        let nameContent = fs.readFileSync(projectsPath + id + '/name.txt', 'utf8');
        console.log("Name content:" + nameContent);
        res.header('project-title', nameContent.replace('\r', '').replace('\n', ''));
        res.sendfile(path, { root: projectsPath });
    });

app.post('/api/list',
    function (req, res) {
        res.send({ projects: req.user.projects, result: 'OK' });
    });

app.get('/cgi/:mime/:site/:path',
    function (req, res, done) {
        const site = req.params.site;
        const mime = req.params.mime.replace('_', '/');
        const path = req.params.path;
        var params = decodeURI(querystring.stringify(req.query));
        params = params.replace(/ /g, '+');
        console.log(`site: ${site}, mime: ${mime}, path: ${path}, params: ${params}`);
        res.contentType(mime);
        const filename = `${site}/${path}?${params}`;
        res.sendfile(filename, { root: '../www/cs' } );
    });

app.get('/projects/:id',
    function (req, res, done) {
	res.redirect('/#project' + req.params.id);
    });

var port = 3000;

app.listen(port, function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log(`SERVER STARTED, isDev={$isDev}`);
    }
});

