'use strict';

let xhr = new XMLHttpRequest();
let btn = document.getElementById('sub-btn');

btn.addEventListener('click',function(e){
    e.preventDefault();
    let form = document.getElementById('addstackdata');
    let url = form.action;
    
    let formData = JSON.stringify(processForm(form));
    
    url += `${formData["stackID"]}/${formData["act"]}`;
    
    
    xhr.onload = success;
    
    xhr.open("post",url,true);
    xhr.send(formData);
    
});

function success(){
    var msgHost = document.getElementById('response');
    let response = JSON.parse(this.responseText);
    
    if(response.status === 200)
        msgHost.innerHTML = `Success! Stack #${response.id} inserted`;
    
    if(response.status === 418)
        msgHost.innerHTML = `You didn't provide information, or something went wrong`;
    
    msgHost.classList = 'response show';
    setTimeout(function(){
        msgHost.classList = "response hide";
    }, 3000);
}

function processForm(form){
    sanitize(form);
    
    let inputs = form.querySelectorAll('input');
    let result = {};
    
    for(let input of inputs){
        result[input.id] = input.value;   
    }
    
    validate(result);
    
    return result;
}

function sanitize(data){
    
    return data;
}

function validate(data){
    
}

