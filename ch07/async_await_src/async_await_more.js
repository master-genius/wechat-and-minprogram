const fs = require('fs');

function delayOut(seconds, str) {

    return new Promise((rv, rj) => {
        setTimeout(function(){
            rv(str);
        }, seconds * 1000);
    });

}

//读取单个文件并返回Promise对象
function read_file(filename) {
    return new Promise((rv, rj) => {
        fs.readFile(filename, {encoding:'utf8'}, (err, data) => {
            if (err) {
                rj(err);
            } else {
                console.log(data);
                rv(data);
            }
        });
    });
}


//延迟1秒输出提示信息，然后读取文件
async function fout(filename) {
    //编号2
    console.log(await delayOut(1, 'prepare to read file:'+filename+'\n'));

    var file_data = await read_file(filename); //编号3
    return file_data;
}

async function fwr(filename, data) {
    return new Promise((rv, rj) => {
        fs.writeFile(filename, data, {encoding : 'utf8'}, (err) => {
            if (err) {
                rj(err);
            } else {
                rv('ok');
            }
        });
    });
}

async function cpf(from_file, to_file) {
    try {
        var from_data = await fout(from_file);  //编号1
        var ret = await fwr(to_file, from_data); //编号4
    } catch (err) {
        throw err; 
    }

    return ret;
}

cpf('test.code', 'promise-async-await.code')
.then(ret => {
    console.log(ret);
}, err => {
    //cpf函数中抛出的错误
    console.log(err.message);
})
.catch(err => {
});
