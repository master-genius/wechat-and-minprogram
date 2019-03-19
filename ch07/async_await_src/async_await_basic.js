
function fa() {
    return 1;
}

function fb() {
    return 2;
}

async function add() {
    //如果await后面跟的不是Promise，则直接返回值
    var x = await fa();
    var y = await fb();
    return x+y;
}

add().then(r => {
    console.log(r);
});
