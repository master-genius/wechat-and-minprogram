const awyhttp = require('awyhttp');
const fs = require('fs');
const wxcall = require('./weixinToken.js');

var thumb_media_id = '某一图片素材的media_id';

var my_news = {
    articles : [
        {
            title : '我是个程序员',
            thumb_media_id : thumb_media_id,
            show_cover_pic : 1,
            content : '我是个程序员，为了成为编程大师，我每天都不停的编码，现在每天都很累，这种生活已经持续了很长时间，我想起大学快乐的时光，那是我逝去的青春。',
            content_source_url : ''

        }
    ]
};

wxcall.getToken()
.then(ret => {
    if (ret.status === false) {
        throw ret.data;
    }

    var add_news = `https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=${ret.data}`;

    return awyhttp.post(add_news, {
        headers : {
            'Content-Type' : 'text/plain'
        },
        data : my_news
    });

}, err => {
    throw err;
})
.then(data => {
    var ret = JSON.parse(data);
    if (ret.errcode !== undefined) {
        throw data;
    }
    console.log(ret);
    var filename = './my_news/'+ret.media_id;
    
    //创建空文件即可，名称就是media_id
    return new Promise((rv, rj) => {
        fs.writeFile(filename, '', {encoding:'utf8'}, (err) => {
            if (err) {
                rj(err);
            } else {
                rv('ok');
            }
        });
    });

}, err => {
    throw err;
})
.catch (err => {
    console.log(err.message);
});
