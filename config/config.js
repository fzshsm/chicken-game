
dbConfig = null
if (DEBUG){
     dbConfig = require('./db_dev');
}else{
     dbConfig = require('./db_production');
}

module.exports = {
    data : {
        api : 'https://pubg.op.gg/api',
        region : {
            as: 'as',
            eu: 'eu',
            na: 'na',
            oc: 'oc',
            sa: 'sa',
            sea: 'sea',
            krjp: 'krjp'
        },
        match : [
            {
                mode: 'tpp',
                queue: 1
            },
            {
                mode: 'tpp',
                queue: 2
            },
            {
                mode: 'tpp',
                queue: 4
            },
            {
                mode: 'fpp',
                queue: 1
            },
            {
                mode: 'fpp',
                queue: 2
            },
            {
                mode: 'fpp',
                queue: 4
            },
        ]
    },
    game : {
        appid : 578080,
        api : 'wss://prod-live-entry.playbattlegrounds.com',
        server : 'CN',
        initCounter : 1000000,
        timezoneOffset : 8,
    },
    db : dbConfig
};