const awy = require('amy');
//const crypto = require('crypto');
const parsexml = require('xml2js').parseString;

var ar = new awy();

ar.config.daemon = true;

function formatTpl(data, msgtype) {

    switch(msgtype) {
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

        default: ;
    }
}

ant.post('/wx/talk', async rr => {

    parsexml(rr.req.GetBody(), (err, result) => {
        if (err) {
            console.log(err);
            rr.res.Body = '';
        } else {
            var xmlmsg = result.xml;
            if (xmlmsg.MsgType == 'text') {
                var data = {
                    touser      : xmlmsg.FromUserName,
                    fromuser    : xmlmsg.ToUserName,
                    msg         : xmlmsg.Content,
                    msgtime     : parseInt((new Date()).getTime() / 1000)
                };
                rr.res.Body = formatTpl(data, 'text');
            } 
        }
    });
});

ant.ants('localhost', 2020);
