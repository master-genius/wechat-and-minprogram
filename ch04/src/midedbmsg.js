const awy = require('awy');
const parsexml = require('xml2js').parseString;
const mysql = require('mysql');

var ant = new awy();

var imageLog = new function() {
    var the = this;

    this.list = [];

    this.randImage = function() {
        if (the.list.length == 0) {
            return null;
        }
        var ind = Math.random() * 1024;
        ind = parseInt(ind % the.list.length);
        console.log(ind);
        return the.list[ ind ];
    };
};

var mdb = mysql.createPool({
    host : '127.0.0.1',
    user : 'master',
    password : 'master2018',
    database : 'wxtest',
    connectionLimit : 10
});
/*
 使用两个函数用于更新用户数据，在用户关注时，
 把openid写入到数据库，如果已经存在则更新unsubscribe为0，

 如果是用户取消关注，则更新unsubscribe为1。

 函数的处理过程没有严格的检测每一步出错的逻辑，
 但是你可以看到使用mysql的回调已经嵌套很深，
 如果逻辑再复杂些，代码复杂度会更加严重。

 并且，你能感受到，这样的代码放在一起很乱，
 用于数据库操作的应该抽离出来，形成独立的模块。

 这些问题我们后面会慢慢解决。

*/
function regUserOpenID(openid) {
    return new Promise((rv, rj) => {
        mdb.query('select openid from wxusers where openid=?', [openid], (err, result, fields) => {
            if (err) {
                rj(err);
            } else {
                rv(result);
            }
        });
    }).then(ret => {
        if (ret.length > 0) {
            mdb.query('update wxusers set unsubscribe=0 where openid=?', [openid], 
                (err, result, fields) => {
                    if (err) {
                        console.log(err);
                    }
            });
        } else {
            mdb.query('insert into wxusers set openid=?', [openid], (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }, err => {
        console.log(err);
    });
}

function setUserUnsubscribe(openid) {
    return new Promise((rv, rj) => {

        mdb.query('update wxusers set unsubscribe=1 where openid=?', 
          [openid], (err, result, fields) => {
            if (err) {
                rj(err);
            } else {
                rv(result);
            }
        });

    }).then(ret => {
    
    }, err => {
    });
}


//ant.config.daemon = true;

function formatTpl(data) {

    //尽管只处理文本消息，这样写的目的是为了后续添加更多的消息类型。
    switch(data.msgtype) {
        case 'text':
            return `
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[${data.msg}]]></Content>
                    <CreateTime>${data.msgtime}</CreateTime>
                </xml>
            `;

        case 'image':
            return `
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[image]]></MsgType>
                    <Image>
                        <MediaId><![CDATA[${data.msg}]]></MediaId>
                    </Image>
                    <CreateTime>${data.msgtime}</CreateTime>
                </xml>
            `;
        
        case 'voice':
            return `
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[voice]]></MsgType>
                    <Voice>
                        <MediaId><![CDATA[${data.msg}]]></MediaId>
                    </Voice>
                    <CreateTime>${data.msgtime}</CreateTime>
                </xml>
            `;
        default: 
            return '';
    }
}

function userMsgHandle(wxmsg, retmsg) {
    if (wxmsg.MsgType === 'text') {
        switch (wxmsg.Content) {
            case 'help':
            case '?':
                retmsg.msgtype = 'text';
                retmsg.msg = '这是一个测试号，输入help获取帮助信息，其他消息原样返回';
                return formatTpl(retmsg);

            case '关于':
            case 'about':
                retmsg.msgtype = 'text';
                retmsg.msg = '我们是程序员';
                return formatTpl(retmsg);
            case 'image':
                var img = imageLog.randImage();
                if (img === null) {
                    retmsg.msgtype = 'text';
                    retmsg.msg = '没有图片';
                } else {
                    retmsg.msgtype = 'image';
                    retmsg.msg = img;
                }
                return formatTpl(retmsg);

            default:;
        }
    }

    switch(wxmsg.MsgType) {
        case 'text':
            retmsg.msg = wxmsg.Content;
            break;
        case 'image':
            retmsg.msg = wxmsg.MediaId;
            break;
        case 'voice':
            retmsg.msg = wxmsg.MediaId;
            break;

        default:
            retmsg.msg = '不支持的消息类型';
            retmsg.msgtype = 'text';
    }
    if (retmsg.msgtype === '') {
        retmsg.msgtype = wxmsg.MsgType;
    }
    return formatTpl(retmsg);
}

function clickKeyMsg(wxmsg, retmsg) {
    if (wxmsg.EventKey == 'about-us') {
        retmsg.msg = `我们是奋斗的程序员`;
        retmsg.msgtype = 'text';
        return formatTpl(retmsg);
    } else {
        return "success";
    }
}

function viewKeyMsg(wxmsg, retmsg) {
    console.log(wxmsg.EventKey);
}

function eventMsgHandle(wxmsg, retmsg) {
    
    switch (wxmsg.Event) {
        case 'LOCATION':
            //console.log(xmsg);
            retmsg.msg = `Latitude: ${wxmsg.Latitude}\nLongitude: ${wxmsg.Longitude}\n`;
            retmsg.msgtype = 'text';
            return formatTpl(retmsg);

        case 'subscribe':
            console.log('User subscribe, OpenID:', wxmsg.FromUserName);
            retmsg.msg = '你好，欢迎关注本公众号，这是一个教学用的测试号';
            retmsg.msgtype = 'text';
            regUserOpenID(wxmsg.FromUserName);
            return formatTpl(retmsg);

        case 'unsubscribe':
            console.log(`取消关注：${wxmsg.FromUserName}`);
            setUserUnsubscribe(wxmsg.FromUserName);
            return ;

        case 'CLICK':
            return clickKeyMsg(wxmsg, retmsg);

        case 'VIEW':
            return viewKeyMsg(wxmsg, retmsg);

        case 'SCAN':
            return '';
            //return scanQrcode(xmsg, retmsg);

        default:
            return "";
    }

}

function msgDispatch(wxmsg, retmsg) {
    if (wxmsg.MsgType === 'event') {
        return eventMsgHandle(wxmsg, retmsg);
    } else {
        return userMsgHandle(wxmsg, retmsg);
    }
}

ant.add(async (rr, next) => {
    if (rr.weixinMsg.wxmsg.MsgType == 'image') {
        imageLog.list.push(rr.weixinMsg.wxmsg.MediaId);
    }
    await next(rr);
}, '/wx/talk');

ant.add(async (rr, next) => {
    
    await new Promise((rv, rj) => {
        parsexml(rr.req.GetBody(), {explicitArray : false}, (err, result) => {
            if (err) {
                rr.res.Body = '';
                rj(err);
            } else {
                var xmlmsg = result.xml;

                var data = {
                    touser      : xmlmsg.FromUserName,
                    fromuser    : xmlmsg.ToUserName,
                    msg         : '',
                    msgtime     : parseInt((new Date()).getTime() / 1000),
                    msgtype     : ''
                };

                rv({
                    wxmsg : xmlmsg,
                    retmsg : data
                });
            }
        });
    }).then((data) => {
        rr.weixinMsg = data;
    }, err=> {
        throw err;
    }).catch(err => {
        console.log(err);
    });

    await next(rr);

}, '/wx/talk');

ant.post('/wx/talk', async rr => {
    
    console.log(rr.req.GetBody());
    
    if (rr.weixinMsg !== undefined) {
        rr.res.Body = msgDispatch(
                        rr.weixinMsg.wxmsg,
                        rr.weixinMsg.retmsg
                      );
    } else {
        rr.res.Body = '';
    }

});

ant.run('localhost', 8192);

