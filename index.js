const argv = require('yargs').argv;
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('pubg:server');
global.moment = require('moment');
global.logger = require('morgan');

process.env.TIME_ZONE = 'Asia/Shanghai';

if (argv.env == 'production'){
    global.DEBUG = false;
}else{
    global.DEBUG = true;
}

process.on('uncaughtException' , (e)=>{
    if (e.errno == 'EADDRINUSE'){
        console.log(`robot '${robotName}' have been used !`);
    }
    process.exit(0);
});

const userRoute = require('./routes/user.js');
const gameRoute = require('./routes/game.js');

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
// app.use(logger('common'));
app.use('/user' , userRoute);
app.use('/game' , gameRoute);
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
        // console.log(err);
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
global.PORT = 3001;
app.listen(PORT);



