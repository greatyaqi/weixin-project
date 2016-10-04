/**
 * Created by great on 2016/10/1.
 */
'use strict'

var sha1 = require('sha1')
var getRawBody = require('raw-body')
var Wechat = require('./wechat')
var util = require('./util')
var Promise = require('bluebird')
var request =Promise.promisify(require('request'))


module.exports = function (opts) {
   // var wechat = new Wechat(opts)
    return function *(next) {
        var token = opts.token
        var signature = this.query.signature
        var nonce = this.query.nonce
        var timestamp = this.query.timestamp
        var echostr = this.query.echostr
        var str = [token, timestamp, nonce].sort().join('')
        var sha = sha1(str)

        if (this.method === 'GET'){
            if (sha === signature) {
                this.body = echostr + ''
            } else {
                this.body = 'wrong!'
            }
        }
       else if (this.method ==='POST'){
            if (sha === signature) {
                var that = this
                this.body = echostr + ''
                var data= yield  getRawBody(this.req,{
                   /* length: this.length,
                    limit: '1mb',
                    encoding: this.charset*/
                })
                console.log(data)

                var content = yield util.parseXMLAsync(data)
                console.log(content)
                var messsage = util.formatMessage(content.xml)
                console.log(messsage)

                if (messsage.MsgType === 'event'){
                    if (messsage.Event === 'subscribe'){
                        var now = new Date().getTime()

                        that.status = 200
                        that.type = 'application/xml'
                        that.body = '<xml>'+
                            '<ToUserName><![CDATA['+messsage.FromUserName+']]></ToUserName>'+
                            '<FromUserName><![CDATA['+messsage.ToUserName+']]></FromUserName>'+
                            '<CreateTime>'+now+'</CreateTime>'+
                            '<MsgType><![CDATA[text]]></MsgType>'+
                            '<Content><![CDATA[我好饿！]]></Content>'+
                            '</xml>'
                    }
                }
            } else {
                this.body = 'wrong!'
                return false
            }
        }
    }
}
