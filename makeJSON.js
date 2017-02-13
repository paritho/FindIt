// stub out the JSON file

let fs = require('fs');
let rd = fs.createReadStream('stackdata.json');
let wr_options = {
    flags:'a',
    encoding: 'utf8',
    mode:'0666',
    autoClose: true    
};
let wr = fs.createWriteStream('stackdata.json', wr_options);

function write(data){
    const buff = Buffer.from(data);
    console.log("writing to file stackdata.json");
    wr.write(`\{"stacks": ${buff} \}`);
    console.log('wrote to stackdata.json');
}

let JSONobj = function JSONobj(id,st_let,st_num,st_dec,end_let,end_num,end_dec){
    //let args = [...arguments];
    return  {
            "id":id,
            "st_cn_letter": st_let,
            "st_cn_num": st_num,
            "st_cn_dec": st_dec,
            "end_cn_letter": end_let,
            "end_cn_num": end_num,
            "end_cn_dec": end_dec
    };
}

write(JSON.stringify(JSONobj(100,'pr',6005,'.h3','ps',6004,'.o4')));

