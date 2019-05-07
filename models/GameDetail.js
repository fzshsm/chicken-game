const Sequelize = require('sequelize');
const mysqlSequelize = require('../helper/Mysql');

module.exports = mysqlSequelize.define('GameDetail' , {
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
    teamId : {
        type : Sequelize.INTEGER,
        field : 'team_id',
    },
    rank : {
        type : Sequelize.INTEGER,
        field : 'rank',
    },
    player : {
        type : Sequelize.STRING,
        field : 'player',
    },
    steamId : {
        type : Sequelize.STRING,
        field : 'steam_id',
    },
    harm : {
        type : Sequelize.INTEGER,
        field : 'harm',
    },
    knockDowns : {
        type : Sequelize.INTEGER,
        field : 'knock_downs',
    },
    longestKill : {
        type : Sequelize.FLOAT,
        field : 'longest_kill',
    },
    killNum : {
        type : Sequelize.INTEGER,
        field : 'kill_num',
    },
    killHeadshot : {
        type : Sequelize.INTEGER,
        field : 'kill_headshot',
    },
    killSteaks : {
        type : Sequelize.INTEGER,
        field : 'killSteaks',
    },
    killRoad : {
        type : Sequelize.INTEGER,
        field : 'kill_road',
    },
    killTeam : {
        type : Sequelize.INTEGER,
        field : 'kill_team',
    },
    killPlace : {
        type : Sequelize.INTEGER,
        field : 'kill_place',
    },
    assists : {
        type : Sequelize.INTEGER,
        field : 'kill_headshot',
    },
    winPlace : {
        type : Sequelize.INTEGER,
        field : 'win_place',
    },
    ratingDelta : {
        type : Sequelize.INTEGER,
        field : 'rating_delta',
    },
    vehicleDestroys : {
        type : Sequelize.INTEGER,
        field : 'vehicle_destroys',
    },
    weaponAcquired : {
        type : Sequelize.INTEGER,
        field : 'weapon_acquired',
    },
    survived : {
        type : Sequelize.INTEGER,
        field : 'survived',
    },
    strengthen : {
        type : Sequelize.INTEGER,
        field : 'strengthen',
    },
    cure : {
        type : Sequelize.INTEGER,
        field : 'cure',
    },
    revives : {
        type : Sequelize.INTEGER,
        field : 'revives',
    },
    rideDistance : {
        type : Sequelize.FLOAT,
        field : 'ride_distance',
    },
    walk_distance : {
        type : Sequelize.FLOAT,
        field : 'walk_distance',
    }
},{
    freezeTableName: true,
    tableName: 'pubg_game_detail',
    createdAt : false,
    updatedAt : false,
    deletedAt : false,
    timestamps: false
});