const fs = require('fs');

//读取单个文件并返回Promise对象
function read_file(filename) {
    return new Promise((rv, rj) => {
        fs.readFile(filename, {encoding:'utf8'}, (err, data) => {
            if (err) {
                rj(err);
            } else {
                rv(data);
            }
        });
    });
}

//读取文件列表，await可能会抛出错误，所以要使用try···catch
async function read_file_list(files) {
    var file_data = '';
    for(var i=0; i<files.length; i++) {
        console.log('----',files[i],'----:\n');
        try {
            file_data = await read_file(files[i]);
            console.log(file_data);
        } catch(err) {
            console.log(err.message);
        }
        
    }
}

read_file_list(['async.js', 'qweu', 'ats.js']);