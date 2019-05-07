
const UserModel = require('../models/User');
const GameService = require('../service/Game');
const CustomGameModel = require('../models/CustomGame');
const _ = require("underscore");
const Data = require('../service/Data');
const UserService = require('../service/User');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

class Game{

    constructor(){
        this.server = '';
        this.map = '';
        this.queue = '';
        this.mode = 'tpp';
        this.supplement = [];
    }

    create(title , password , config){
        return new Promise((resolve , reject)=>{
            this.supplement = [];
            GameService.createRoom(ROBOT , title , password , config).then(()=>{
                resolve();
            }).catch(error=>{
                reject(error);
            });
        }).then(()=>{
            return new Promise((resolve , reject)=>{
                GameService.joinObServer(ROBOT.accountId).then(()=>{
                    resolve();
                }).catch(error=>{
                    reject(error);
                });
            });
        }).then(()=>{
            return this.roomInfo();
        }).catch(error=>{
            return Promise.reject(error);
        });
    }

    update(title , password){
        return new Promise((resolve,reject)=>{
            GameService.roomInfo().then((result)=>{
                resolve(result.Config);
            }).catch(error=>{
                reject(error);
            });
        }).then((config)=>{
           return new Promise((resolve , reject)=>{
               GameService.updateRoom(ROBOT , title , password , config).then(()=>{
                   resolve(true);
               }).catch(error=>{
                   reject(error);
               });
           });
        }).then(()=>{
            return this.roomInfo();
        }).catch(error=>{
            return Promise.reject(error);
        });
    }

    start(leagueId , seasonId ,gid){
        return new Promise((resolve , reject)=>{
            let startTime = Math.round(new Date().getTime() / 1000);
            setTimeout(()=>{
                console.log('setTimeOut saveGame');
                GameService.info().then(gameInfo=>{
                    console.log(gameInfo);
                    this.saveGame(leagueId , seasonId ,gid , gameInfo , startTime);
                }).catch(error=>{
                    reject(error);
                });
            } , 120000);
            GameService.start().then(status=>{
                resolve(true);
            }).catch(error=>{
                reject(error);
            });
        }).catch(error=>{
            console.log(error);
            return Promise.reject(error);
        });
    }

    saveGame(leagueId , seasonId , gid , gameInfo , startTime){
        return new Promise((resolve , reject)=>{
            resolve(
                CustomGameModel.findCreateFind({
                    where : {
                        gid : gid
                    },
                    defaults : {
                        leagueId : leagueId,
                        seasonId : seasonId,
                        gid : gid,
                        matchId : gameInfo.GameSessionId,
                        server : this.server,
                        queue : this.queue,
                        mode : this.mode,
                        participate : 0,
                        map : this.map.split('/')[3],
                        gameBeginTime : startTime,
                        createUser : gameInfo.PartnerId,
                        createTime : Math.round(new Date().getTime() / 1000)
                    }
                }).catch(error=>{
                    //error
                    reject(error);
                })
            );
        });
    }

    deleteRoom(){
        return new Promise((resolve , reject)=>{
            GameService.deleteRoom().then(status=>{
                resolve(status);
            }).catch(error=>{
                reject(error);
            })
        });
    }

    getAtRoomPlayers(result){
        let players = [];
        _.each(result.Players , (data , key)=>{
            if (data != null){
                players[key] = {
                    steamId : data.PlayerNetId,
                    nickname : data.Nickname,
                    accountId : data.AccountId
                };
            }else{
                players[key] = null;
            }
        });
        return players;
    }

    getAtObServer(result){
        let ob = [];
        _.each(result.Observers , (data , key)=>{
            if (data != null){
                ob[key] = {
                    steamId : data.PlayerNetId,
                    nickname : data.Nickname,
                    accountId : data.AccountId
                };
            }else{
                ob[key] = null;
            }
        });
        return ob;
    }

    getAtUnassigns(result){
        let unassigns = [];
        _.each(result.Unassigns , (data , key)=>{
            if (data != null){
                unassigns[key] = {
                    steamId : data.PlayerNetId,
                    nickname : data.Nickname,
                    accountId : data.AccountId
                };
            }else{
                unassigns[key] = null;
            }
        });
        return unassigns;
    }

    getSupplementPlayer(result){
        _.each(result.Players , (data , key)=>{
            this.supplementPlayerData(data , key);
        });
        _.each(result.Unassigns , (data , key)=>{
            this.supplementPlayerData(data , key);
        });
        return this.supplement;
    }


    supplementPlayerData(data , key){
        if (data != null){
            this.supplement[key] = {
                steamId : data.PlayerNetId,
                nickname : data.Nickname
            };
            UserModel.findCreateFind({
                where : {
                    nickname : data.Nickname
                },
                defaults : {
                    nickname : data.Nickname,
                    steamId : data.PlayerNetId,
                    accountId : data.AccountId
                }
            }).catch(error=>{
                console.log(error);
            });
        }
    }

    status(){
        return new Promise((resolve,reject)=>{
            GameService.info().then(result=>{
                let status = null;
                if (result != null){
                    status = result.GameEnded ?  'finish' : 'play';
                }
                resolve(status);
            }).catch(error=>{
                reject(error);
            });
        });
    }

    roomInfo(){
        return new Promise((resolve,reject)=>{
            GameService.roomInfo().then(result=>{
                this.server = result.Config.Region;
                this.map = result.Config.MapId;
                this.queue = result.Config.TeamSize;
                let roomInfo = {
                    status : result.State,
                    playerCount : result.PlayerCount,
                    players : this.getAtRoomPlayers(result),
                    ob: this.getAtObServer(result),
                    unassigns : this.getAtUnassigns(result),
                    supplement : this.getSupplementPlayer(result),

                };
                let checkOb = false;
                _.each(roomInfo.ob , (obUser)=>{
                    if (obUser.nickname == ROBOT.name){
                        checkOb = true;
                    }
                });
                if (checkOb == false){
                    let account = ROBOT.accountId.replace(/account/ig , 'customgame2') + '.0';
                    GameService.joinCustomGame(account).then(()=>{
                        resolve(roomInfo);
                    }).catch(error=>{
                        reject(error);
                    });
                }else{
                    resolve(roomInfo);
                }
            }).catch(error=>{
                reject(error);
            });
        });
    }


    kickPlayer(accountId){
        return new Promise((resolve,reject)=>{
            GameService.kickPlayer(accountId).then(status=>{
                resolve(true);
            }).catch(error=>{
                reject(error);
            });
        });
    }

    movePlayerToUnassigns(accountId){
        return new Promise((resolve , reject)=>{
            GameService.joinUnassigns(accountId).then(status=>{
                resolve(true);
            }).catch(error=>{
                reject(error);
            });
        });
    }

    movePlayerToOb(accountId){
        return new Promise((resolve , reject)=>{
            GameService.joinObServer(accountId).then(status=>{
                resolve(true);
            }).catch(error=>{
                reject(error);
            });
        });
    }


    movePlayer(accountId , slotNum){
        return new Promise((resolve , reject)=>{
            GameService.movePlayer(accountId , slotNum).then(status=>{
                resolve(true);
            }).catch(error=>{
                reject(error);
            });
        });
    }

    updateVersion(version){
        return new Promise((resolve , reject)=>{
            try{
                console.log(process.platform);
                let versionFile = path.resolve(__dirname , '../version');
                let status = fs.writeFileSync(versionFile , version);
                console.log(process.platform);
                resolve(true);
            }catch(e){
                reject(e.message);
            }
        });
    }

    getUserInfo(nickname){
        return new Promise((resolve , reject)=>{
            UserService.getStateByNickname(nickname).then(data=>{
                if (data != null){
                    resolve({
                        nickname : data.Nickname,
                        avatarUrl : data.AvatarUrl
                    });
                }else{
                    resolve(null);
                }
            }).catch(error=>{
                reject(error);
            });
        })
    }



    killProcess(){
        if (process.platform == 'linux'){
            exec('');
        }
    }

    getVersion(){
        return new Promise((resolve , reject)=>{
            try{
                let versionFile = path.resolve(__dirname , '../version');
                let version = fs.readFileSync(versionFile).toString();
                console.log(version);
                resolve(version);
            }catch(e){
                reject(e.message);
            }
        });
    }

    test(){
        return new Promise((resolve , reject)=>{
            UserService.getStateBySteamId('76561198829942611').then(data=>{
                resolve(true)
            }).catch(error=>{
                reject(error);
            });
        });
    }
}

module.exports = new Game();