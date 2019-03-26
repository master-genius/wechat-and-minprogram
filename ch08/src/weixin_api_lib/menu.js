const awyhttp = require('awyhttp');
const atoken = require('./access_token.js');

function wxmenu() {

    var the = this;

    this.set = async function (menu_data) {
        try {
            if (typeof menu_data === 'object') {
                menu_data = JSON.stringify(menu_data);
            }
            var token = await the.token();

            var create_menu_api = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`;

            var retdata = await awyhttp.post(create_menu_api, {
                data : menu_data,
                headers : {
                    'Content-Type'  : 'text/plain'
                }
            });

            var ret = JSON.parse(retdata);
            if (parseInt(ret.errcode) !== 0) {
                return {
                    err : retdata,
                    data : null
                };
            }
            return {
                err : null,
                data : ret
            };

        } catch (err) {
            return {
                err : err.message,
                data : null
            };
        }
    };

    this.get = async function() {

        try {
            var token = await the.token();
            var get_menu_api = `https://api.weixin.qq.com/cgi-bin/menu/get?access_token=${token}`;

            var retdata = await awyhttp.get(get_menu_api);
            var retobj = JSON.parse(retdata);

            if (retobj.errcode !== undefined 
                && parseInt(retobj.errcode) !== 0
            ) {
                return {
                    err : retdata,
                    data : null
                };
            }

            return {
                err : null,
                data : retdata
            };
            
        } catch (err) {
            return {
                err : err.message,
                data : null
            };
        }

    };

    this.delete = async function () {
        try {
            var token = await the.token();
            var delete_menu_api = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${token}`;

            var retdata = await awyhttp.get(delete_menu_api);
            var ret = JSON.parse(retdata);
            if (parseInt(ret.errcode) !== 0) {
                return {
                    err : retdata,
                    data : null
                };
            }
            return {
                err : null,
                data : ret
            };
        } catch (err) {
            return {
                err : err.message,
                data : null
            };
        }
    };

};

wxmenu.prototype.token = async function () {

    /**
     * 目前接口获取access_token采用从本地服务获取，本地服务运行在localhost:5555
     * 依赖于接口，而不是依赖于实现细节，至于接口是否采用其他方式，对此处没有影响，
     * 这里的处理只需要知道调用此接口可以获取access_token。
     */

    return atoken();
};

module.exports = new wxmenu();
