const Sequelize = require('sequelize');
const mysqlSequelize = require('../helper/Mysql');

module.exports = mysqlSequelize.define('Game' , {
    id : {
        field : 'id',
        type : Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        unique: true
    },
    type : {
        field : 'type',
        type: Sequelize.STRING,
    },
    matchId : {
        type : Sequelize.STRING,
        field : 'match_id',
    },
    matchMd5 : {
        type : Sequelize.STRING,
        field : 'match_md5',
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
    participate : {
        type : Sequelize.INTEGER,
        field : 'participate',
    },
    map : {
        type : Sequelize.STRING,
        field : 'map',
    },
    gameBeginTime : {
        type : Sequelize.STRING,
        field : 'game_begin_time',
    },
    status : {
        type : Sequelize.STRING,
        field : 'status',
        defaultValue : 'wait'
    },
    createTime : {
        type : Sequelize.INTEGER,
        field : 'create_time',
        defaultValue : ()=>{
            let date = new Date();
            return Math.floor(date.getTime() / 1000);
        }
    }
},{
    freezeTableName: true,
    tableName: 'pubg_game',
    createdAt : 'create_time',
    updatedAt : false,
    deletedAt : false,
    timestamps: false
});