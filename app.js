/**
 * Created by great on 2016/9/29.
 */

'use strict'

var Koa = require('koa');
var path = require('path')
var sha1 = require('sha1');
var wechat = require('./wechat/g')
var util = require('./libs/util')
var wechat_file = path.join(__dirname ,'./config/wechat.txt')

var config = {
    wechat: {
        appID: 'wxaea5687ee1b1d6a6',
        appSecret: '14d529bbefaf2bdb24a8494e9d4192d9',
        token: 'weixin',
        getAccessToken :function () {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken : function (data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file,data)
        }
    }
}

var app = new Koa();
app.use(wechat(config.wechat))

app.listen(process.env.PORT || 1234);
console.log('listening 1234')