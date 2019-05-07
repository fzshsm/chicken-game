const Sequelize = require('sequelize');
const mysqlSequelize = require('../helper/Mysql');

module.exports = mysqlSequelize.define('CustomGame' , {
    id : {
        field : 'id',
        type : Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        unique: true
    },
    leagueId : {
        field : 'league_id',
        type: Sequelize.INTEGER,
        defaultValue : 0
    },
    seasonId : {
        field : 'season_id',
        type: Sequelize.INTEGER,
        defaultValue : 0
    },
    gid : {
        field : 'gid',
        type: Sequelize.INTEGER,
        allowNull : false,
        unique: true
    },
    matchId : {
        field : 'match_id',
        type: Sequelize.STRING,
        allowNull : false
    },
    server : {
        type : Sequelize.STRING,
        field : 'server',
    },
    queue : {
        type : Sequelize.STRING,
        field : 'queue',
    },
    mode : {
        type : Sequelize.STRING,
        field : 'mode',
    },
    participate : {
        type : Sequelize.STRING,
        field : 'participate',
    },
    map : {
        type : Sequelize.STRING,
        field : 'map',
    },
    gameBeginTime : {
        type : Sequelize.INTEGER,
        field : 'game_begin_time'
    },
    status : {
        type : Sequelize.STRING,
        field : 'status',
        defaultValue : 'play'
    },
    createUser :{
        type : Sequelize.STRING,
        field : 'create_user',
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
    tableName: 'pubg_custom_game',
    createdAt : 'create_time',
    updatedAt : false,
    deletedAt : false,
    timestamps: false
});