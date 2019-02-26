const xmlparse = require('xml2js').parseString;

var xml_text = `
    <xml>
        <from>Albert</from>
        <to>Hilbert</to>
        <content>E=MC^2</content>
    </xml>
`;

/*
    默认情况explicitArray为true，这会把单个字段数据解析为数组，
    使用比较麻烦。
*/

xmlparse(xml_text, {explicitArray : false}, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});
