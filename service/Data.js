const dataConfig = require('../config/config.js').data;
const request = require('request');
const helper = require("underscore");

class Data {

    constructor(){
        this.url = dataConfig.api;
        this.requestOptions = {
            headers : {
                'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
            },
            timeout : 10000
        };
        this.error = '';
    }

    checkRequiredParam(params , requiredParams){
        this.error = '';
        try{
            if(!helper.isObject(params)){
                throw new Error('params is not object !');
            }
            if (!helper.isArray(requiredParams)){
                throw new Error('params is not array !');
            }
            helper.each(requiredParams , (value)=>{
                if (!helper.has(params , value)){
                    throw new Error(`Missing ${value} in parameters!`);
                }
            });
            return true;
        }catch(e){
            this.error = e.message;
            return false;
        }
    }

    getOpGgUserId(nickname){
        return new Promise((resolve , reject)=>{
            if (nickname ==  ''){
                reject('not found nickname');
            }
            request.get('https://pubg.op.gg/user/' + nickname ,
                {
                    headers : this.requestOptions.headers,
                    timeout : this.requestOptions.timeout
                }, (error , response , body)=>{
                if (body == ''){
                    reject('not found content');
                }
                let matchData = body.match(/data\-user_id\=\"(\w+)/i);
                if(matchData != null && matchData.length >= 2){
                    resolve(matchData[1]);
                }else{
                    reject('not found OpGgUserId');
                }
            });
        });
    }

    getPlayerRecentlySeasonServer(opGgUserId){
        return new Promise((resolve,reject)=>{
            if (opGgUserId == null){
                reject('invalid opGgUserId');
            }
            request.get(`${dataConfig.api}/users/${opGgUserId}` , helper.extend(this.requestOptions , {json:true}) , (error , response , result)=>{
                try{
                    if (response.statusCode >= 400){
                        throw new Error(response.statusMessage);
                    }
                    if (result == ''){
                        throw new Error('not found content');
                    }
                    if (result.seasons == ''){
                        throw new Error('not found server');
                    }
                    resolve(result.seasons[result.seasons.length - 1]);
                }catch(e){
                    reject(e.message);
                }
            });
        });
    }

    getPlayerSummaryByServerAndSeason(requestParams){
        let requiredParam = ['opGgUserId' , 'server' , 'season' , 'mode' , 'queue'];
        return new Promise((resolve , reject)=>{
            if (!this.checkRequiredParam(requestParams , requiredParam)){
                reject(this.error);
            }
            request.get(`${dataConfig.api}/users/${requestParams.opGgUserId}/ranked-stats` , {
                headers : this.requestOptions.headers,
                timeout : this.requestOptions.timeout,
                qs : {
                    season : requestParams.season,
                    server : requestParams.server,
                    queue_size : requestParams.queue,
                    mode : requestParams.mode
                },
                json : true
            } , (error , response , result)=>{
                try{
                    if (response.statusCode >= 400){
                        throw new Error(response.statusMessage);
                    }
                    resolve(result);
                }catch(e){
                    reject(e.message);
                }
            });
        });
    }

    getRecentlyMatcheList(requestParams){
        let requiredParam = ['opGgUserId' , 'server' , 'season' , 'mode' , 'queue'];
        return new Promise((resolve , reject)=>{
            if (!this.checkRequiredParam(requestParams , requiredParam)){
                reject(this.error);
            }
            request.get(`${dataConfig.api}/users/${requestParams.opGgUserId}/matches/recent` , {
                headers : this.requestOptions.headers,
                timeout : this.requestOptions.timeout,
                qs : {
                    season : requestParams.season,
                    server : requestParams.server,
                    queue_size : requestParams.queue,
                    mode : requestParams.mode
                },
                json : true
            } , (error , response , result)=>{
                try{
                    if (response.statusCode >= 400){
                        throw new Error(response.statusMessage);
                    }
                    resolve(result.matches.items);
                }catch(e){
                    reject(e.message);
                }
            });
        });
    }

    getMatchDetail(matchId){
        return new Promise((resolve , reject)=>{
            if (matchId == null){
                reject('missing matchId!');
            }
            request.get(`${dataConfig.api}/matches/${matchId}` , {
                headers : this.requestOptions.headers,
                timeout : this.requestOptions.timeout,
                json : true
            } , (error , response , result)=>{
                try{
                    if (response.statusCode >= 400){
                        throw new Error(response.statusMessage);
                    }
                    resolve(result);
                }catch(e){
                    reject(e.message);
                }
            });
        });
    }

    getMatchDeath(matchId){
        return new Promise((resolve , reject)=>{
            if (matchId == null){
                reject('missing matchId!');
            }
            request.get(`${dataConfig.api}/matches/${matchId}/deaths` , {
                headers : this.requestOptions.headers,
                timeout : this.requestOptions.timeout,
                json : true
            } , (error , response , result)=>{
                try{
                    if (response.statusCode >= 400){
                        throw new Error(response.statusMessage);
                    }
                    resolve(result);
                }catch(e){
                    reject(e.message);
                }
            });
        });
    }



}

module.exports = new Data();