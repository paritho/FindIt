'use strict';

let xhr = new XMLHttpRequest();
let btn = document.getElementById('sub-btn');

btn.addEventListener('click',function(e){
    e.preventDefault();
    let form = document.getElementById('addstackdata');
    let url = form.action;
    
    let formData = processForm(form);
    
    if(!validate(formData)) {
        showInvalid(this);
        return false;
    }
    
    url += `${formData["stackID"]}/${formData["act"]}`;
        
    xhr.onload = success;
    
    xhr.open(form.method,url,true);
    xhr.send(JSON.stringify(formData));
    
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
        
    let inputs = form.querySelectorAll('input');
    let result = {};
    
    for(let input of inputs){
        result[input.id] = input.value;   
    }
    
    return result;
}

function validate(data){
    // that there is data is checked in a blur event
    // so we check for valid data here
    
    let callNumRgx = /(\w{2})(\d+)\s(\.\w{1}\d+)/gi,
        startCallNum = data.stCallNumber,
        endCallNum = data.endCallNumber;

    return startCallNum.match(callNumRgx) && endCallNum.match(callNumRgx);
}

function showInvalid(el){
    el.classList += " danger";
    el.innerHTML = "Your input isn't valid";
}

