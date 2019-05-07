const config = require('../config/config.js');
const dataConfig = config.data;
const request = require('request');
const UserModel = require('../models/User');
const OpggUserModel = require('../models/OpggUser');
const UserService = require('../service/User');
const Data = require('../service/Data');
const Steam = require('../service/Steam');
class User {

    constructor(){
        this.url = dataConfig.api;
    }

    steamBind(baseUrl , returnUrl){
        let buffer = new Buffer(returnUrl);
        return new Promise((resolve) => {
            let steamLoginUrl = "https://steamcommunity.com/openid/login";
            let params = {
                'openid.ns'			: 'http://specs.openid.net/auth/2.0',
                'openid.mode'		: 'checkid_setup',
                'openid.return_to'	: baseUrl + '/user/save/steamId?returnUrl=' + buffer.toString('base64'),
                'openid.realm'		: baseUrl,
                'openid.identity'	: 'http://specs.openid.net/auth/2.0/identifier_select',
                'openid.claimed_id'	: 'http://specs.openid.net/auth/2.0/identifier_select',
            };
            let paramStr = '';
            for(let param in params){
                paramStr += param + '=' + params[param] + '&';
            }
            resolve(steamLoginUrl + "?" + paramStr);
        });
    }

    fromSteamBack(claimedId){
        return new Promise((resolve , reject)=>{
            let matchData = claimedId.match(/openid\/id\/(\d+)/i);
            if(matchData == null || matchData.length < 2){
                reject('not found steamId');
            }
            let steamId = matchData[1];
            this.register(steamId).then(data=>{
                resolve(data);
            }).catch(error=>{
                reject(error);
            });
        });
    }

    register(steamId){
        let resultData = {steamId : steamId , nickname : '' , avatar : ''};
        return new Promise((resolve , reject) => {
            Steam.getPlayerSummaries(steamId).then(data=>{
                UserModel.findCreateFind({
                    where : {
                        steamId : steamId
                    },
                    defaults : {
                        steamId : steamId
                    }
                }).then(result =>{
                    resolve({
                        steamId : steamId,
                        nickname : data.personaname,
                        avatar : data.avatarfull
                    });
                }).catch(error=>{
                    //error
                    console.log(error);
                    resolve(resultData);
                });
            }).catch(error=>{
                reject(error);
            });
        });
    }

    register2(nickname){
        return new Promise((resolve , reject)=>{
            OpggUserModel.findOne({
                where : {
                    nickname : nickname
                }
            }).then(user=>{
                if (user == null){
                    Data.getOpGgUserId(nickname).then(opGgUserId=>{
                        OpggUserModel.create({  nickname : nickname , opggId : opGgUserId }).then(()=>{
                            resolve({'register' : true});
                        }).catch(error=>{
                            reject(error);
                        });
                    }).catch(error=>{
                        console.log(error);
                        reject(error);
                    });
                }else{
                    resolve({'exist' : true});
                }
            }).catch(error=>{
                reject(error);
            });
        });
    }

    updateOpGgUserId(steamId , nickname){
        Data.getOpGgUserId(nickname).then(opGgUserId=>{
            UserModel.update({ opGgUserId : opGgUserId } , { where : {steamId : steamId} });
        }).catch(error=>{
            console.log(error);
        });
    }

    /*
    searchSteamAPI(){
        let requestUrl = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + steamConfig.key + "&steamids=" + steamId;
            request.get(requestUrl , (error , response , body)=>{
                let responseData = JSON.parse(body);
                let players = responseData.response.players;
                if (players.length > 0){
                    this.register(players[0]).then(data => {
                        resolve(data);
                    }).catch(error => {
                        reject(error);
                    });
                }else{
                    reject('not found player info!');
                }
            });
    }
    */

    test(){
        // UserModel.findOne({
        //     where : {
        //         steamId : '76561198157617944'
        //     }
        // }).then(user=>{
        //     console.log(user);
        // }).catch(error=>{
        //
        // });
        UserService.getStateBySteamId('76561198350406698').then(data=>{
            console.log(data);
        }).catch(error=>{
            console.log(error);
        });
        /*Data.getOpGgUserId('fzshsm2').then(id=>{
            console.log(id);
        });*/
    }
}

module.exports = new User();