'use strict';

function strip(data){
    // clear malictous char from data
    return data.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi,'');
}

module.exports.strip = strip;
