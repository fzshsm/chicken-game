
global.DEBUG = true;
const logger = require('morgan');
const helper = require('underscore');
const User = require('../models/User');
const Data = require('../controllers/Data');




const pageSize = 10;

User.count({
    // where : {
    //     dataInitialize : 'no'
    // }
}).then(total=>{
    return new Promise((resolve , reject)=>{
        let totalPage = Math.ceil(total / pageSize);
        for (let page = 1; page <= totalPage ; page ++){
            User.findAll({
                // where : {
                //     dataInitialize : 'no'
                // },
                order : [['id' , 'ASC']],
                offset:(page - 1) * pageSize,
                limit:pageSize
            }).then(dataList=>{
                helper.each(dataList , (data)=>{
                    if (data != null  && data.opGgUserId != null){
                        Data.userGameSummary(data.opGgUserId , data.steamId , data.nickname).then(()=>{
                            data.update({
                                dataInitialize : 'yes'
                            });
                        });
                    }
                });
            }).catch(error=>{
                reject(error);
            });
        }
        resolve(true);
    });
}).catch(error=>{
    logger(error);
    console.log(error);
});
