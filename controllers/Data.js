const helper = require("underscore");
const sequelize = require('sequelize');
const crypto = require('crypto');
const config = require('../config/config').data;
const DataService = require('../service/Data');
const UserGame = require('../models/UserGame');
const Game = require('../models/Game');
const GameDetail = require('../models/GameDetail');
const GameDeath = require('../models/GameDeath');

class Data{

    userGameSummary(opGgUserId , steamId , nickname){
        return new Promise((resolve , reject)=>{
            DataService.getPlayerRecentlySeasonServer(opGgUserId)
            .then((recentlySeasonServer)=>{
                resolve(recentlySeasonServer);
            }).catch(error=>{
                console.log(error);
                reject(error);
            });
        }).then((recentlySeasonServer)=>{
            return new Promise((resolve , reject)=>{
                let userRecentlyGameInfo = {
                    season : recentlySeasonServer.season,
                    server : [],
                };
                helper.each(recentlySeasonServer.servers , (data)=>{
                    userRecentlyGameInfo.server.push(data.server);
                    helper.each(config.match , (value)=>{
                        this.getPlayerSummaryByServerAndSeason(opGgUserId , data.server , recentlySeasonServer.season , value.mode , value.queue).then((result)=>{
                            this.saveSingleUserGame( steamId, nickname , data.server, recentlySeasonServer.season, value.mode , value.queue, result).catch(error=>{
                                reject(error);
                            });
                        }).catch(error=>{
                            reject(error);
                        });
                    });
                }).then(()=>{
                    resolve(userRecentlyGameInfo);
                });
            }).then(()=>{

            });
        }).catch(error=>{
            console.log(error)
        });
    }


    saveSingleUserGame(steamId , nickname , server , season , mode , queue , result){
        return new Promise((resolve , reject)=>{
            let data = {
                steamId : steamId,
                nickname : nickname,
                season : season,
                server : server,
                mode : mode ,
                queue : queue,
                match : result.stats.matches_cnt,
                win : result.stats.win_matches_cnt,
                top : result.stats.topten_matches_cnt,
                grade : result.grade,
                score : result.stats.rating,
                totalRating : result.max_ranks.rating,
                rating : result.ranks.rating,
                rank : Math.floor(result.stats.rank_avg),
                harm : result.stats.damage_dealt_avg.toFixed(2),
                survived : result.stats.time_survived_avg.toFixed(2),
                kill : result.stats.kills_sum,
                killMax : result.stats.kills_max,
                killLongest : result.stats.longest_kill_max.toFixed(2),
                headshot : result.stats.headshot_kills_sum,
                dead : result.stats.deaths_sum,
                assists : result.stats.assists_sum,
            };
            UserGame.find({
                where : {
                    steamId : steamId,
                    season : season,
                    server : server,
                    mode : mode ,
                    queue : queue
                }
            }).then((userGameResult)=>{
                if (userGameResult == null){
                    resolve(UserGame.create(data).catch(error=>{
                        reject(error);
                    }));
                }else{
                    data.updateTime = UserGame.updateTime;
                    resolve(userGameResult.update(data).catch(error=>{
                        reject(error);
                    }));
                }
            }).catch(error=>{
                //error
                console.log(error);
                reject(error);
            });
        });
    }


    getPlayerSummaryByServerAndSeason(opGgUserId , server , season , mode , queue){
        return new Promise((resolve , reject)=>{
            DataService.getPlayerSummaryByServerAndSeason({
                opGgUserId : opGgUserId,
                server : server,
                season : season,
                mode : mode ,
                queue : queue
            }).then((result)=>{
                resolve(result);
            }).catch(error=>{
                reject(error);
            })
        });
    }


    processGameByUser(user , userGame){
        return new Promise((resolve , reject)=>{
            DataService.getRecentlyMatcheList({
                opGgUserId : user.opGgUserId,
                server : userGame.server,
                season : userGame.season,
                mode : userGame.mode ,
                queue : userGame.queue
            }).then((resultList)=>{
                helper.each(resultList , (gameData)=>{
                    let matchMd5 = crypto.createHash('md5').update(gameData.match_id).digest('hex');
                    let gameInfo = JSON.parse(new Buffer(gameData.offset , 'base64').toString());
                    /*
                        todo
                        这里改成findCreateFind的方式去创建，并且详情中只创建当前人的记录，异步去采集游戏的详情与死亡细节
                        优先采集死亡细节，更新game表中的状态
                        游戏详情采集完成后更新游戏状态
                    */
                    Game.findCreateFind({
                        where : {
                            matchMd5 : matchMd5
                        },
                        defaults : {
                            type : gameData.type,
                            matchId : gameData.match_id,
                            matchMd5 : matchMd5,
                            season : gameInfo.season,
                            server : gameData.server,
                            queue : gameData.queue_size,
                            mode : gameData.mode,
                            participate : gameData.total_rank,
                            map : '',
                            gameBeginTime : gameInfo.started_at
                        }
                    }).then((game)=>{
                        this.saveGameDetail(game.id , gameData , user.steamId);
                    }).catch(error=>{
                        //error
                        reject(error);
                    });
                });
                resolve();
            }).catch(error=>{
                reject(error);
            });
        });
    }

/*    saveGame(gameData , user){
        return new Promise((resolve , reject)=>{
            sequelize.transaction().then(transaction=>{
                Game.create({
                    type : gameData.type,

                }).then(game=>{
                    this.saveGameDetail(gameData.participant , game.matchId);
                    return game;
                }).then((game)=>{
                    DataService.getMatchDetail(game.matchId).then(gameDetail=>{
                        helper.each(gameDetail.teams , (data)=>{
                            helper.each(data.participants , (value)=>{
                                if (value.user.nickname != user.nickname){
                                    this.saveGameDetail(value , game.matchId , '' , data.stats.rank , data._id);
                                }else{
                                    this.updateGameDetail(game.matchId , user.steamId , value , data.stats.rank , data._id);
                                }
                            });
                        });
                    }).catch(error=>{
                        throw new Error(error);
                    });
                    return game;
                }).then(game=>{
                    DataService.getMatchDeath(game.matchId).then(deadDetail=>{
                        let maps = {MIRAMAR : 'Desert' , ERANGEL : 'Erangel'};
                        let map =  helper.has(maps , deadDetail.map_id) ?  maps[deadDetail.map_id] : 'Unknown';
                        game.update({
                            mapId : map
                        });
                        this.saveGameDeath(deadDetail.deatchs).then(()=>{
                            resolve(transaction.commit());
                        }).catch(error=>{
                            throw new Error(error);
                        });
                    }).catch(error=>{
                        throw new Error(error);
                    });
                }).catch(error=>{
                    transaction.rollback();
                    reject(error);
                });
            });
        });
    }*/

    saveGameDetail(gameId , gameDetailData , userSteamId = null , teamData = null){
        return new Promise((resolve , reject)=>{
            let participant = null;
            let team = null;
            if (helper.has(gameDetailData , 'participant')){
                participant = gameDetailData.participant;
            }else{
                participant = gameDetailData;
            }
            if (helper.has(gameDetailData , 'team')){
                team = gameDetailData.team;
            }else{
                team = teamData
            }
            GameDetail.findCreateFind({
                where : {
                    gameId : gameId,
                    player : gameDetailData.participant.user.nickname
                },
                defaults : {
                    gameId : gameId,
                    teamId : team._id,
                    rank : team.stats.rank,
                    player : participant.user.nickname,
                    steamId : userSteamId,
                    harm : participant.stats.combat.damage.damage_dealt,
                    knockDowns : participant.stats.combat.dbno.knock_downs,
                    longestKill : participant.stats.combat.kda.longest_kill.toFixed(2),
                    killNum : participant.stats.combat.kda.kills,
                    killHeadshot : participant.stats.combat.kda.headshot_kills,
                    killSteaks : participant.stats.combat.kda.kill_steaks,
                    killRoad : participant.stats.combat.kda.road_kills,
                    killTeam : participant.stats.combat.kda.team_kills,
                    killPlace : participant.stats.combat.kill_place,
                    assists : participant.stats.combat.kda.assists,
                    winPlace : participant.stats.combat.win_place,
                    ratingDelta : participant.stats.rating_delta.toFixed(2),
                    vehicleDestroys : participant.stats.combat.vehicle_destroys,
                    weaponAcquired : participant.stats.combat.weapon_acquired,
                    survived : participant.stats.combat.time_survived.toFixed(2),
                    strengthen : participant.stats.combat.boosts,
                    cure : participant.stats.combat.heals,
                    revives : participant.stats.combat.dbno.revives,
                    rideDistance : participant.stats.combat.distance_traveled.ride_distance,
                    walDistance : participant.stats.combat.distance_traveled.walk_distance
                }
            }).then(result=>{
                resolve(result);
            }).catch(error=>{
                reject(error);
            });
        });
    }

    updateGameDetail(){

    }

    saveGameDeath(gameId , deadList){
        helper.each(deadList , (data)=>{
            GameDeath.findCreateFind({
                where : {
                    gameId : gameId,
                    killer : data.killer.user.nickname,
                    victim : data.victim.user.nickname,
                },
                defaults : {
                    gameId : gameId,
                    eventTime : data.time_event,
                    killer : data.killer.user.nickname,
                    killPostion : `${data.killer.position.x},${data.killer.position.y}`,
                    killDistance : this.calcDistance(data.killer.position , data.victim.position),
                    killRank : data.killer.rank == null ? 1 : data.killer.rank,
                    victim : data.victim.user.nickname,
                    victimPosition : `${data.victim.position.x},${data.victim.position.y}`,
                    victimRank : data.victim.rank,
                    description : data.description
                }
            }).catch(error=>{
                //error
                console.log(error);
                throw new Error(error);
            });
        });
    }

    calcDistance(killerPosition , victimPosition){
        let xPos = Math.pow(victimPosition.x - killerPosition.x , 2);
        let yPos = Math.pow(victimPosition.y - killerPosition.y , 2);
        let killDistance = Math.sqrt(xPos + yPos) / 100;
        return killDistance.toFixed(2);
    }

}

module.exports = new Data();