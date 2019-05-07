
const crypto = require('crypto');

global.DEBUG = true;

const Data = require('./service/Data');
const User = require('./models/User');

global.moment = require('moment');

// let md5Str = crypto.createHash('md5').update('123456789').digest('hex');

// Data.getOpGgUserId('T-Bear1').then((result)=>{
//     console.log(result);
// }).catch(error=>{
//     console.log(error);
// });
// let a = JSON.parse(new Buffer('eyJfaWQiOiI1YWQ4OGU0NDFhZGIxOTAwMDFmNmRkMGEiLCJzdGFydGVkX2F0IjoxNTI0MTM5NDY1LCJzZWFzb24iOiIyMDE4LTA0In0=' , 'base64').toString());

// let date = '2018-03-23T07:07:54+0000';
//
// let time = Math.round(moment(date).format('x') / 1000);

// console.log(moment.now());

let a = [];

console.log(typeof a);

/*User.findCreateFind({
    where : {
        steamId : '76561198157617944xxx'
    }
}).then((result)=>{
    console.log(result);
}).catch(error=>{
    console.log(error);
});*/
/*
Data.getPlayerRecentlySeasonServer('5ad76de4de94df0001096c68').then((server)=>{
    console.log(server);
});

Data.getPlayerSummaryByServerAndSeason({
    opGgUserId : '5ad76de4de94df0001096c68',
    server : server,
    mode : mode ,
    queue : queue
}).then((server)=>{
    console.log(server);
});*/

// Data.getMatchDeath('Svg7Thpx__N3LAxphviehxzrP2TeTCFvSb1rpwUmdcRR37PQLOsNmO21BgRvSByWcC7xRcMwocdTPk_gp6MAmkMtOmeQ9JmSu3fvoKWvmPp2xPMmkG3Et8nTjJw8A54MF-F-odY8gQw=').then((result)=>{ //59fd9482018ffa0001b36f67
//     console.log('success');
//     console.log(result);
// }).catch(error=>{
//     console.log('fail');
//     console.log(error);
// });

/*Data.getRecentlyMatcheList({
    opGgUserId:'59fd9482018ffa0001b36f67',
    server : 'as',
    season : '2018-04',
    queue : 4,
    mode : 'tpp'
}).then((result)=>{ //59fd9482018ffa0001b36f67
    console.log('success');
    console.log(result);
}).catch(error=>{
    console.log('fail');
    console.log(error);
});*/





