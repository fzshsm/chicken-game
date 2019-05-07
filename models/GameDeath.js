const Sequelize = require('sequelize');
const mysqlSequelize = require('../helper/Mysql');

module.exports = mysqlSequelize.define('GameDeath' , {
    id : {
        field : 'id',
        type : Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        unique: true
    },
    gameId : {
        field : 'game_id',
        type: Sequelize.INTEGER,
    },
    eventTime : {
        type : Sequelize.INTEGER,
        field : 'event_time',
    },
    killer : {
        type : Sequelize.STRING,
        field : 'killer',
    },
    killPosition : {
        type : Sequelize.STRING,
        field : 'kill_position',
    },
    killDistance : {
        type : Sequelize.FLOAT,
        field : 'server',
    },
    killRank : {
        type : Sequelize.INTEGER,
        field : 'kill_rank',
    },
    victim : {
        type : Sequelize.STRING,
        field : 'victim',
    },
    victimPosition : {
        type : Sequelize.STRING,
        field : 'victim_position',
    },
    victimRank : {
        type : Sequelize.INTEGER,
        field : 'victim_rank',
    },
    description : {
        type : Sequelize.STRING,
        field : 'description',
    }
},{
    freezeTableName: true,
    tableName: 'pubg_game_death',
    createdAt : 'create_time',
    updatedAt : false,
    deletedAt : false,
    timestamps: false
});