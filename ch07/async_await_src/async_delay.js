
function delay(seconds, str) {
    return new Promise((rv, rj) => {
        setTimeout(function() {
            rv(str);
        }, seconds * 1000);
    });
}

async function ax() {
    var x = await delay(2, 'success');
    var y = await delay(3, 'ok');

    //和同步的函数处理类似，总共延迟5秒后才会输出结果

    console.log(x, y);
}

ax();

