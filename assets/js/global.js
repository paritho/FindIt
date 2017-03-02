'use strict';

let xhr = new XMLHttpRequest();

document.addEventListener('click',function(e){
    let update_btn = document.getElementById('update-btn'),
        another_btn = document.getElementById('another-btn'),
        cancel_btn = document.getElementById('cancel-btn');

    // there was a previous error showing, remove it    
    if(e.target.type == 'text') removeValidationError();
    
     switch(e.target.id){
        case "update-btn":
            updateBtnHandler();
            e.stopPropagation();
            toggleHide(update_btn,another_btn,cancel_btn);
            break;
        case "cancel-btn":
            cancelBtnHandler();
            e.stopPropagation();
            toggleHide(update_btn,another_btn,cancel_btn);
            break;
        case "sub-btn":
            submitBtnHandler(e);
            break;
    }
});

function updateBtnHandler(){
    let inputs = document.querySelectorAll('input');
    inputs.forEach(function(input){
        if(input.getAttribute('id') == "stackID" || input.getAttribute('id')=="vis-Id") return;
        input.removeAttribute("readonly");
        input.classList = "";
     });
    
}

function cancelBtnHandler(){
    let inputs = document.querySelectorAll('input');
    inputs.forEach(function(input){
        input.setAttribute('readonly', true);
        input.classList = 'readonly';
    });
}

function submitBtnHandler(e){
    e.preventDefault();
    let stIdInput = document.getElementById('stackID'),
        id = stIdInput.value,
        form = document.querySelector('form');

    let formData = processForm(form);
    if(!validate(formData)){
        showInvalid(e.target);
        return;
    }

    let url = `${form.action}${id}`;
    
    xhr.onload = success;

    if(form.method === 'post'){
        url += `/${formData["act"]}`;
        xhr.open(form.method,url,true);
        xhr.send(JSON.stringify(formData));
        return;
    }

    xhr.open(form.method,url,true);
    xhr.send();
}

function processForm(form){
    let inputs = form.querySelectorAll('input');
    let result = {};
    
    for(let input of inputs) result[input.id] = input.value;   
    
    return result;
}

function validate(data){

    let callNumRgx = /(\w{2})(\d+)\s(\.\w{1}\d+)/gi,
        idRgx = /^[0-9]{3}$/g,
        // so that this works on forms where we aren't checking the id
        valid = true;
    
    if(!data.startCallNumber || !data.endCallNumber) {
        valid = data.stackID && data.stackID.match(idRgx);
        return valid;
    }

    valid = valid && (data.startCallNumber && data.startCallNumber.match(callNumRgx));
    valid = valid && (data.endCallNumber && data.endCallNumber.match(callNumRgx));

    return valid;
}

function showInvalid(el){
    el.classList.add("danger");
    el.innerHTML = "Your input isn't valid";
}

function removeValidationError(){
    // error will always be showing on the sub-btn element
    let btn = document.getElementById('sub-btn');

    if(!btn.classList.contains('danger')) return;

    btn.classList.remove('danger');
    btn.innerHTML = "Submit";
}

// arguments should be html elements which need to be toggled
function toggleHide(){
    for(let arg of arguments) arg.classList.toggle('hide');
}

function success(){
    var msgHost = document.getElementById('response');
    let formWrapper = document.getElementById('form-content');
    let response = JSON.parse(this.responseText);
    
    switch(response.status){
        case 200:
            msgHost.innerHTML = `${response.msg} Stack #${response.id} inserted`;
            break;
        case 201:
            msgHost.innerHTML = `Info for Stack ${response.id} found`;
            formWrapper.innerHTML = response.msg;
            break;
        case 300:
            msgHost.innerHTML = `${response.msg}`;
            break;
        case 400:
            msgHost.innerHTML = `${response.msg}`;
            break;
        case 404:
            msgHost.innerHTML = `Stack with id: ${response.id}, ${response.msg}`;
            break;
    }
    
    msgHost.classList = 'response show';
    setTimeout(function(){
        msgHost.classList = "response hide";
    }, 3000);
}