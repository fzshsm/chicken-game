const Sequelize = require('sequelize');
const mysqlSequelize = require('../helper/Mysql');

module.exports = mysqlSequelize.define('OpggUser' , {
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
    opggId : {
        type : Sequelize.STRING,
        field : 'opgg_id',
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
    tableName: 'pubg_opgg_user',
    createdAt : 'create_time',
    updatedAt : false,
    deletedAt : false,
    timestamps: false
});