const argv = require('yargs').argv;
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('pubg:server');
global.moment = require('moment');
global.logger = require('morgan');


if (argv.env == 'production'){
    global.DEBUG = false;
}else{
    global.DEBUG = true;
}

if(typeof argv.robot == 'undefined'){
    console.log('must set param --robot !');
    process.exit(-401);
}

const robotName = argv.robot;
const robotConfig = require('./config/robot');

if (typeof robotConfig[robotName] == 'undefined'){
    console.log(`robot '${robotName}' don't exist ! check robot config`);
    process.exit(-404);
}

process.on('uncaughtException' , (e)=>{
    if (e.errno == 'EADDRINUSE'){
        console.log(`robot '${robotName}' have been used !`);
    }
    console.log(e);
    process.exit(0);
});

const gameConfig = require('./config/config').game;
const Robot = require('./service/Robot');
const SteamUser = require('steam-user');
const robotRoute = require('./routes/game.js');


let app = express();
app.use(logger((tokens, req, res)=>{
    let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    return [
        `[ ${nowTime} ]`,
        req.ip,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
}));
app.use('/game' , robotRoute);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
    res.status(err.status || 500);
    if (DEBUG){
        console.log(err);
    }
    if (err){
        res.json({
            code : err.status,
            status : 'error',
            message : err.message,
            result : null
        });
    }
    next(err);
});


global.ROBOT = {
    name : robotName,
    steamId : null,
    accountId : null,
    port : robotConfig[robotName].port
};

let steamUser = new SteamUser();
steamUser.logOn({
    "accountName": robotConfig[robotName].account,
    "password": robotConfig[robotName].password
});

steamUser.on('loggedOn', function(details) {
    let steamId = steamUser.steamID.getSteamID64();
    console.log("Logged into Steam as " + steamId);
    steamUser.setPersona(SteamUser.EPersonaState.Online);
    steamUser.gamesPlayed(gameConfig.appid, true);
    steamUser.getAuthSessionTicket(gameConfig.appid, function (err, ticket) {
        ROBOT.steamId = steamId;
        global.ROBOT_SERVICE = new Robot(steamId , ticket.toString('hex').toUpperCase() , 10000);
    })
});

app.listen(robotConfig[robotName].port);