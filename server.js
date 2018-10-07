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
const adminApp = express();

const isDev = process.env.ISDEV;

var session = require("express-session"),
    bodyParser = require("body-parser");

app.use(express.static('build'));
app.use('/assets', express.static('assets'));

adminApp.use('/admin', express.static('admin/dist/admin'));
adminApp.use(session({ name:'connect.sid.scratchadmin', secret: 'csfirst-admin' }));
adminApp.use(bodyParser.raw({ inflate: true, limit: '100000kb', type: 'application/zip' }));
adminApp.use(bodyParser.json());
adminApp.use(bodyParser.urlencoded({ extended: true }));
adminApp.use(passport.initialize());
adminApp.use(passport.session());
adminApp.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(session({ name: 'connect.sid.scratch', secret: 'csfirst-offline' }));

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
        // If user is not found, we automatically create it.
        if (username === 'admin') {
            // This is a special case when admin is logging in for the first time
            // and we need to create admin user automatically using DEFAULT password.
            // This avoids the case if someone uses admin user from scratch directly.
            if (password !== 'admin') {
                req.autherror = 'Incorrect password';
                return done(null, false);
            }
            password = 'admin';
        }
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

// Api to log-in users.
function loginSuccess(req, res) {
    var username = req.user.username;
    var created = (typeof (req.user.created) != 'undefined' && req.user.created == true);
    res.send({ result: 'AUTHENTICATED', user: username, created: created });
}

function loginError(err, req, res, next) {
    if (req.autherror) {
        res.status(401).send(req.autherror);
    }
  }


function checkauth(req, res) {
    if (!req.user) {
        req.autherror = 'User not found. May be you need to sign in?';
        res.status(401).send(req.autherror);
        return false;
    }
    if (req.user.username !== req.query.username) {
        console.log("Wrong user: " + req.user.username);
        req.autherror = 'Wrong user, can you try to sign in?';
        res.status(401).send(req.autherror);
        return false;
    }
    return true;
}

app.post('/api/login',
    passport.authenticate('local', { failWithError: true }),
    loginSuccess,
    loginError
    );

adminApp.post('/api/login',
    passport.authenticate('local', { failWithError: true }),
    loginSuccess,
    loginError
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


// Scratch cloud: save project that this user owns into their personal cloud
app.post('/api/save',
    function (req, res, done) {
        if (!checkauth(req, res)) {
            return done(null, false);
        }
        console.log(`Saving project: ${req.query.id}, user: ${req.user.username}`);
        let id = req.query.id;
        const title = req.query.title ? req.query.title : 'Untitled';
        const pm = projectMap(req.user.projects);
        if (!id || !pm[id]) {
            return createNewProject(req, res, pm, title, done);
        } else {
            return updateExistingProject(req, res, pm, title, id, done);
        }
    });

// Scratch cloud: load project that this user owns from the cloud
app.post('/api/load',
    function (req, res, done) {
        if (!checkauth(req, res)) {
            return done(null, false);
        }
        const id = req.query.id;
        ScratchProject.findById(id)
            .then((project) => {
                if (project.owner === req.user.username) {
                    res.contentType("application/zip");
                    res.send(project.data);
                } else {
                    done('Wrong owner');
                }
            })
            .catch((err) => done('Can not find project by id'));
    });

// Scratch / CS First - public template project:
app.get('/api/template/:id',
    function (req, res, done) {
        const id = req.params.id;
        const path = id + "/index.sb2";
        res.contentType("application/zip");
        let nameContent = fs.readFileSync(projectsPath + id + '/name.txt', 'utf8');
        res.header('project-title', nameContent.replace('\r', '').replace('\n', ''));
        res.sendfile(path, { root: projectsPath });
    });

// Scratch cloud: list projects for the user
app.post('/api/list',
    function (req, res,done) {
        if (!checkauth(req, res)) {
            return done(null, false);
        }
        res.send({ projects: req.user.projects, result: 'OK' });
    });

// Admin app list all users in the system
adminApp.post('/api/users',
    function (req, res, done) {
        if (!req.user || req.user.username !== 'admin') {
            return done('Not admin');
        }
        User.findAll({ offset: req.query.offset, limit: 1000 }).then(
            (users) => {
                users.forEach((user) => {
                    user.password = undefined;
                });
                res.send({ users: users });
            });
    });

// Fonts.gstatic / fonts.googleapi.com easy decoding / simulation
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

// Scratch.mit.edu redirect api
app.get('/projects/:id',
    function (req, res, done) {
	res.redirect('/#project' + req.params.id);
    });

// Admin app change password api
adminApp.post('/api/changepwd',
    function (req, res, done) {
        if (!req.user) {
            return done('User not found');
        }
        let user = req.user;
        if (req.body.username !== user.username) {
            if (user.username !== 'admin') {
                return done('Only admin can do this');
            }
            // We will impersonate here by finding user record
            user = User.findOne({ where: { username: req.body.username } })
            .then((impersonatedUser) =>
              {
                changePassword(req, res, impersonatedUser, done);
              })
            .catch((err) => {
                req.autherror = 'Can not find user';
                return done(null, false);
            });
        } else {
            changePassword(req, res, user, done);
        }
    });

function changePassword(req, res, user, done) {
    const password = req.body.password;
    if (!password || password.length<4) {
        return done('Wrong password');
    }
    var hashedPassword = passwordHash.generate(password, {});
    user.password = hashedPassword;
    user.save({}).then((validationError) => {
        if (typeof (validationError.errors) == 'undefined') {
            res.send({ result: 'OK' });
        } else {
            done(validationError.errors);
        }
    })
    .catch((err) =>
        done('Can not change password')
    );
}

// Admin app delete user API
adminApp.post('/api/deleteUser',
    function (req, res, done) {
        if (!req.user) {
            return done('User not found');
        }
        if (req.user.username !== 'admin') {
            return done('You are not administrator');
        }
        if (req.body.username === 'admin') {
          return done('You can not delete administrator');
        }
        // TODO: actually delete req.body.username
        User.findOne({ where: { username: req.body.username } })
            .then((user) =>
             {
                for (p of user.projects) {
                    console.log("Deleting project: " + p.projectId);
                    ScratchProject.findById(p.projectId)
                    .then(
                        (project) => {
                            project.destroy().then(
                                (status) => {
                                    console.log("Deleted project: " + p.title);
                                }
                            )
                        }
                    );
                }
                console.log("Deleting user: " + user.id);
                user.destroy().then
                (
                    (status) => {
                        console.log("User deleted: " + user.username);
                        res.send({ result: 'OK' });
                    }
                );
            })
            .catch((err) => {
                req.autherror = 'Can not find user';
                return done(null, false);
            });
    });

var port = 3000;

app.listen(port, function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log(`SERVER STARTED, isDev={$isDev}`);
    }
});

adminApp.listen(port+1, function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log(`ADMIN SERVER STARTED, isDev={$isDev}`);
    }
});

