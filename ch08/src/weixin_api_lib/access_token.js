const awyhttp = require('awyhttp');

module.exports = async function () {

    try {
        var t = await awyhttp.get('http://localhost:5555/access_token');
        var ret = JSON.parse(t);
        if (ret.status == 'ok') {
            return ret.token;
        } else {
            throw new Error('Erro: failed get access_token');
        }

    } catch (err) {
        throw err;
    }
};