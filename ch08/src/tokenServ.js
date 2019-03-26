const awy = require('awy');
const awyhttp = require('awyhttp');
const wxkey = require('./weixinkey.js');


var ant = new awy();

var _token = {
    access_token : '',
    expires_in : 7200,
    get_time : 0
};

async function getToken() {
    var token_api = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxkey.appid}&secret=${wxkey.appsecret}`;
    try {
        var t = await awyhttp.get(token_api);
        var ret = JSON.parse(t);
        if (ret.errcode !== undefined) {
            console.log(t);
        } else {
            _token.access_token = ret.access_token;
            _token.expires_in = ret.expires_in;
            _token.get_time = parseInt( (new Date()).getTime() );
        }
    } catch (err) {
        console.log(err.message);
    }
}

/** 
 * 首次运行，先获取access_token
*/
if (_token.get_time == 0) {
    getToken();
}

//设置定时器，每隔3600秒更新access_token
setInterval(function(){
    getToken();
}, 3600000);

ant.get('/access_token', async rr => {

    rr.res.Body = {
        status : 'ok',
        token : _token.access_token
    };
    
});

ant.run('localhost', 5555);
