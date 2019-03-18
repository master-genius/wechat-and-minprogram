const awyhttp = require('awyhttp');
const wxcall = require('./weixinToken.js');
const qs = require('querystring');

var access_token = '';

/*
    {
        type : TYPE,
        offset : OFFSET,
        count : COUNT
    }
 
*/

async function getMediaList(token, post_args) {
    var media_list_api = `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${token}`;

    var retdata = {};
    await awyhttp.post(media_list_api, {
            headers : {
                'Content-Type'  : 'text/plain'
            },
            data : post_args
        }).then(data => {
            retdata = {
                err : null,
                data : data
            };
        }, err => {
            retdata = {
                err : err,
                data : null
            };
            console.log(err);
        });
    return retdata;
}

async function downloadImage(token, media_id, url) {
    var urlobj = new URL(url);
    var qargs = qs.parse(urlobj.search.substring(1));
    var image_name = media_id + '.' + qargs['wx_fmt'];

    var down_image_api = `https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=${token}`;

    var state = true;

    await awyhttp.download(down_image_api, {
        method : 'POST',
        data : {
            media_id : media_id
        },
        headers : {
            'Content-Type' : 'text/plain'
        },
        target : './image_list/' + image_name
    }).then(data => {
        state = true;
    }, err => {
        state = false;
    });
    return state;
}


wxcall.getToken()
.then(ret => {
    if (ret.status) {
        access_token = ret.data;
        return ret.data;
    } else {
        throw ret.data;
    }
}, err => {
    throw err;
})
.then(token => {
    //获取素材总数
    var get_media_total = `https://api.weixin.qq.com/cgi-bin/material/get_materialcount?access_token=${token}`;

    return awyhttp.get(get_media_total)
            .then(data => {
                var ret = JSON.parse(data);
                if (ret.errcode !== undefined) {
                    throw data;
                }
                return ret;
            }, err => {
                throw err;
            });

})
.then(async ret => {
    var total = ret.image_count;

    var offset = 0;
    var count = 20;
    var retlist = null;
    var tmpr = null;
    var down_tmp = null;

    for(var i=offset; i<total; i += count) {
        retlist = await getMediaList(access_token, {
            type : 'image',
            offset : i,
            count : count
        });
        if (retlist.err) {
            throw retlist.err;
        }
        
        tmpr = JSON.parse(retlist.data);
        for(var j = 0; j < tmpr.item.length; j++) {
            console.log('downloading:', tmpr.item[j].media_id);
            down_tmp = await downloadImage(access_token, tmpr.item[j].media_id, tmpr.item[j].url);
            if (!down_tmp) {
                break;
            }
        }
        
    }

})
.catch(err => {
    console.log(err);
});

