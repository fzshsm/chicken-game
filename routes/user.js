const router = require('express').Router();
const Response = require('../helper/Response.js');
const User = require('../controllers/User.js');
const config = require('../config/config');


router.route('/register').get((req, res , next)=>{
    let nickname = req.query['nickname'];
    if (nickname == null || nickname == ''){
        Response.error(res , "param nickname can't be empty");
    }else{
        User.register2(nickname).then(result=>{
            Response.send(res , result);
        }).catch(error=>{
            Response.error(res , error);
        });
    }
});

router.route('/steam/bind').get((req, res , next)=>{
    let returnUrl = req.query['returnUrl'];
    let baseUrl = req.protocol + '://' + req.hostname + ":" + PORT;
    User.steamBind(baseUrl , returnUrl).then(redirectUrl => {
        // res.redirect(redirectUrl);
        Response.send(res , redirectUrl);
    }).catch(error=>{
        next(error);
    });
});

router.route('/save/steamId').get((req, res , next)=>{
    let buffer = new Buffer(req.query['returnUrl'], 'base64');
    let returnUrl = buffer.toString();
    let claimedId = decodeURIComponent(req.query['openid.claimed_id']);
    User.fromSteamBack(claimedId).then(data => {
        let paramStr = '';
        for (let param in data){
            paramStr += param + '=' + data[param] + '&';
        }
        if (returnUrl.indexOf('?') >= 0){
            res.redirect(returnUrl + '&' + paramStr);
        }else{
            res.redirect(returnUrl + '?' + paramStr);
        }
    }).catch(error=>{
        next(error);
    });
});


router.route('/test').get((req, resolve,next)=>{
    User.test();
    next();
});
module.exports = router;