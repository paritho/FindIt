'use strict';

let xhr = new XMLHttpRequest();
let btn = document.getElementById('input-btn');

btn.addEventListener('click',function(e){
    e.preventDefault();
    let form = document.getElementById('inputStack');
    let url = form.action;
    
    // processForm() from global.js
    let formData = processForm(form);
    
    // validate() from global.js
    if(!validate(formData)) {
        showInvalid(this);
        return false;
    }
    
    url += `${formData["stackID"]}/${formData["act"]}`;
        
    xhr.onload = success;
    
    xhr.open(form.method,url,true);
    xhr.send(JSON.stringify(formData));
    
});




