'use strict';

let xhr = new XMLHttpRequest();
let url = '//127.0.0.1:3333';
let btn = document.getElementById('sub-btn');

function success(msg){
    var msgHost = document.getElementById('response');
    msgHost.textContent = JSON.stringify(msg);
    msgHost.classList = 'response show';
    setTimeout(function(){
        msgHost.classList = "response hide";
    }, 3000);
}

btn.addEventListener('click',function(e){
    e.preventDefault();
    let form = document.getElementById('addstackdata');
    let formData = new FormData(form);
  
    xhr.onload = success;
    
    xhr.open("post",url,true);
    xhr.send(formData);
    
});

