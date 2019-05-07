const Sequelize = require('sequelize');
const dbconfig = require('../config/config.js').db;
module.exports = new Sequelize({
    dialect : 'mysql',
    dialectOptions: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    database : dbconfig.database,
    username : dbconfig.user,
    password : dbconfig.password,
    host : dbconfig.host,
    port : dbconfig.port,
    pool : {
        max : 5,
        min : 1
    }
});