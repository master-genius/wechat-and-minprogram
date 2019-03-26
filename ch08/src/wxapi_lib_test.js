const wxmenu = require('./weixin_api_lib/menu');

wxmenu.get()
.then(ret => {
    if (ret.err) {
        console.log(ret.err);
    } else {
        console.log(ret.data);
    }
});

/*
wxmenu.delete()
.then(ret => {
    console.log(ret);
});
*/
