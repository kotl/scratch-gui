const Sequelize = require('sequelize');
const fs = require('fs');
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './data/db.sqlite',
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

module.exports = { User, ScratchProject };

