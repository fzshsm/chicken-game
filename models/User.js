const Sequelize = require('sequelize');
const mysqlSequelize = require('../helper/Mysql');

module.exports = mysqlSequelize.define('User' , {
    id : {
        field : 'id',
        type : Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        unique: true
    },
    nickname : {
        field : 'nickname',
        type: Sequelize.STRING
    },
    steamId : {
        type : Sequelize.STRING,
        field : 'steam_id',
        allowNull : false,
        unique: true
    },
    accountId : {
        type : Sequelize.STRING,
        field : 'account_id',
    },
    opGgUserId : {
        type : Sequelize.STRING,
        field : 'op_gg_user_id',
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
    tableName: 'pubg_user',
    createdAt : 'create_time',
    updatedAt : false,
    deletedAt : false,
    timestamps: false
});