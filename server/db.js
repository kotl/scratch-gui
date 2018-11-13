const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

var installDir = path.dirname(process.argv0);

if (process.argv.length > 2) {
  if (!process.argv[process.argv.length-1].startsWith('--')) {
	installDir = process.argv[process.argv.length-1];
  }
}

if (!fs.existsSync(installDir + '/data')) {
  fs.mkdirSync(installDir + '/data');
}

const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: installDir + '/data/db.sqlite',
});

const ScratchProject = sequelize.define('scratchproject', {
    owner: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    data: {
        type: Sequelize.BLOB
    },
    projectId: {
        primaryKey: true,
        type: Sequelize.INTEGER, autoIncrement: true
    }
});

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'compositeIndex',
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER, autoIncrement: true
    },
    projects:
    {
        defaultValue: [],
        type: Sequelize.JSON,
    }
});

User.sync();
ScratchProject.sync();

module.exports = { User, ScratchProject, installDir };

