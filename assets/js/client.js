'use strict';

let xhr = new XMLHttpRequest();
let btn = document.getElementById('sub-btn');

function success(){
    var msgHost = document.getElementById('response');
    msgHost.innerHTML = this.responseText;
    msgHost.classList = 'response show';
    setTimeout(function(){
        msgHost.classList = "response hide";
    }, 3000);
}

btn.addEventListener('click',function(e){
    e.preventDefault();
    let form = document.getElementById('addstackdata');
    let url = form.action;
    
    //validate(form);
    let formData = JSON.stringify(processForm(form));
    
    url += `${formData["stackID"]}/${formData["act"]}`;
    
    
    xhr.onload = success;
    
    xhr.open("post",url,true);
    xhr.send(formData);
    
});


function processForm(form){
    let inputs = form.querySelectorAll('input');
    let result = {};
    
    for(let input of inputs){
        result[input.id] = input.value;   
    }
    
    return result;
}