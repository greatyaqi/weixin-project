/**
 * Created by great on 2016/9/29.
 */

'use strict'

var Koa = require('koa');
var sha1 = require('sha1');
var config = {
    wechat: {
        appID: 'wxaea5687ee1b1d6a6',
        appSecret: '14d529bbefaf2bdb24a8494e9d4192d9',
        token: '2312443425436534'
    }
}

var app = new Koa();
app.use(function *(next) {
    // console.log(this.query)
    var token = config.wechat.token
    var signature = this.query.signature
    var nonce = this.query.nonce
    var timestamp = this.query.timestamp
    var echostr = this.query.echostr
    var str = [token, timestamp, nonce].sort().join(',')
    var sha = sha1(str)

    if (sha === signature) {
        this.body = echostr + ''
    } else {
        this.body = 'wrong!'
    }
})

app.listen(process.env.PORT || 1234);
console.log('listening 1234')