const router = require('express').Router();
const Response = require('../helper/Response.js');
const Game = require('../controllers/Game');


router.route('/user').get((req, res , next)=>{
    let nickname = req.query['nickname'];
    if (nickname == null || nickname == ''){
        Response.error(res , "param nickname can't be empty");
    }
    Game.getUserInfo(nickname).then(userInfo=>{
        Response.send(res , userInfo);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/room/create').get((req, res , next)=>{
    let title = req.query['title'];
    let password = req.query['password'];
    let config = req.query['config'];
    if (config == null || config == ''){
        Response.error(res , "param config can't be empty");
    }
    if (typeof config == 'string' && config.length % 4 != 0){
        Response.error(res , "param config not in base64 format.");
    }
    Game.create(title , password , config).then(roomInfo=>{
        Response.send(res , roomInfo);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/room/update').get((req, res , next)=>{
    let title = req.query['title'];
    let password = req.query['password'];
    Game.update(title , password).then(roomInfo=>{
        Response.send(res , roomInfo);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/room/delete').get((req, res , next)=>{
    Game.deleteRoom().then(result=>{
        Response.send(res , result);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/room').get((req, res , next)=>{
    Game.roomInfo().then(result=>{
        Response.send(res , result);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/status').get((req, res , next)=>{
    Game.status().then(result=>{
        Response.send(res , result);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/start').get((req, res , next)=>{
    let leagueId = req.query['leagueId'];
    let seasonId = req.query['seasonId'];
    let gid = req.query['gid'];
    Game.start(leagueId , seasonId , gid).then(status=>{
        Response.send(res , true);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/kick/player').get((req, res , next)=>{
    let accountId = req.query['accountId'];
    Game.kickPlayer(accountId).then(status=>{
        Response.send(res , true);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/move/player').get((req, res , next)=>{
    let accountId = req.query['accountId'];
    let slotNum = req.query['slotNum'];
    Game.movePlayer(accountId , slotNum).then(status=>{
        Response.send(res , true);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/player/ob').get((req, res , next)=>{
    let accountId = req.query['accountId'];
    Game.movePlayerToOb(accountId).then(status=>{
        Response.send(res , true);
    }).catch(error=>{-
        Response.error(res , error);
    });
});

router.route('/player/unready').get((req, res , next)=>{
    let accountId = req.query['accountId'];
    Game.movePlayerToUnassigns(accountId).then(status=>{
        Response.send(res , true);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/set/version').get((req, res , next)=>{
    let version = req.query['v'];
    Game.updateVersion(version).then(status=>{
        Response.send(res , true);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/version').get((req, res , next)=>{
    Game.getVersion().then(version=>{
        Response.send(res , version);
    }).catch(error=>{
        Response.error(res , error);
    });
});

router.route('/test').get((req, res , next)=>{
    Game.test().then(status=>{
        Response.send(res , status);
    }).catch(error=>{
        Response.error(res , error);
    });
});


module.exports = router;