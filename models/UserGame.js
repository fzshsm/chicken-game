const Sequelize = require('sequelize');
const mysqlSequelize = require('../helper/Mysql');

module.exports = mysqlSequelize.define('UserGame' , {
    id : {
        field : 'id',
        type : Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        unique: true
    },
    nickname : {
        type : Sequelize.STRING,
        field : 'nickname',
    },
    steamId : {
        type : Sequelize.STRING,
        field : 'steam_id',
    },
    season : {
        type : Sequelize.STRING,
        field : 'season',
    },
    server : {
        type : Sequelize.STRING,
        field : 'server',
    },
    queue : {
        type : Sequelize.INTEGER,
        field : 'queue',
    },
    mode : {
        type : Sequelize.STRING,
        field : 'mode',
    },
    match : {
        type : Sequelize.INTEGER,
        field : 'match',
    },
    win : {
        type : Sequelize.INTEGER,
        field : 'win',
    },
    top : {
        type : Sequelize.INTEGER,
        field : 'top',
    },
    grade : {
        type : Sequelize.STRING,
        field : 'grade',
    },
    score : {
        type : Sequelize.INTEGER,
        field : 'score',
    },
    totalRating : {
        type : Sequelize.INTEGER,
        field : 'total_rating',
    },
    rating : {
        type : Sequelize.INTEGER,
        field : 'rating',
    },
    rank : {
        type : Sequelize.INTEGER,
        field : 'rank',
    },
    harm : {
        type : Sequelize.FLOAT,
        field : 'harm',
    },
    survived : {
        type : Sequelize.FLOAT,
        field : 'survived',
    },
    kill : {
        type : Sequelize.INTEGER,
        field : 'kill',
    },
    killMax : {
        type : Sequelize.INTEGER,
        field : 'kill_max',
    },
    killLongest : {
        type : Sequelize.FLOAT,
        field : 'kill_longest',
    },
    headshot : {
        type : Sequelize.INTEGER,
        field : 'headshot',
    },
    dead : {
        type : Sequelize.INTEGER,
        field : 'dead',
    },
    assists : {
        type : Sequelize.INTEGER,
        field : 'assists',
    },
    createTime : {
        type : Sequelize.INTEGER,
        field : 'create_time',
        defaultValue : ()=>{
            let date = new Date();
            return Math.floor(date.getTime() / 1000);
        }
    },
    updateTime : {
        type : Sequelize.INTEGER,
        field : 'update_time',
        defaultValue : ()=>{
            let date = new Date();
            return Math.floor(date.getTime() / 1000);
        }
    }
},{
    freezeTableName: true,
    tableName: 'pubg_user_game',
    createdAt : 'create_time',
    updatedAt : 'update_time',
    deletedAt : false,
    timestamps: false
});