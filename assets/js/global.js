'use strict';

let xhr = new XMLHttpRequest();

document.getElementById('container').addEventListener('click', function(e){
    let btns = document.querySelectorAll('[id$="-btn"]');

    // there was a previous error showing, remove it    
    if(e.target.type == 'text') removeValidationError();
    
     switch(e.target.id){
        case "update-btn":
            updateBtnHandler();
            toggleHide(...btns);
            break;
        case "sub-btn":
            submitBtnHandler(e);
            break;
        case 'del-btn':
            deleteBtnHandler();
            break;
    }
});


// function for handling the 'update stack' btn
function updateBtnHandler(){
    let inputs = document.querySelectorAll('input');
    inputs.forEach(function(input){
        if(input.getAttribute('id') == "stackID" || input.getAttribute('id')=="vis-Id") return;
        input.removeAttribute("readonly");
        input.classList = "";
     });
}

// function for handling form submission. 
function submitBtnHandler(e){
    e.preventDefault();
    let stIdInput = document.getElementById('stackID'),
        form = document.querySelector('form');

    let formData = processForm(form);
    /*if(!validate(formData)){
        showInvalid(e.target);
        return;
    }*/

    let url = `${form.action}${stIdInput.value}`;
    
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

function deleteBtnHandler(){
    let id = document.getElementById('stackID').value;
    let confirm = prompt('Are you sure? Enter the stack ID to confirm delete. This cannot be undone.');

    if(confirm == id){
        let dxhr = new XMLHttpRequest();
        dxhr.onload = success;
        dxhr.open('delete','/api/stacks/'+id,true);
        dxhr.send();
    }
}

// loops over each input in form and builds an obj in the form of:
// {inputName: inputValue}
function processForm(form){
    let inputs = form.querySelectorAll('input');
    let result = {};
    
    for(let input of inputs) result[input.id] = input.value;   
    
    return result;
}

// returns true if input is in the form of:
// 3 digits for stack id
// PR6005 .H4 for callnumbers.
function validate(data){
    // TODO: update rgx to allow for cn like pr6003.3 a899
    let callNumRgx = /(\w{2})(\d+)\s(\.\w{1}\d+)/gi,
        idRgx = /^[0-9]{3}$/g,
        valid = false;

    let inputs = document.querySelectorAll('input');
    for(let input of inputs){
        if(input.id === 'act') continue;
        if(input.value === "") return false;
        if(input.id === 'stackID') {
            valid = idRgx.test(input.value);
            continue;
        }
        valid = callNumRgx.test(input.value);
    }
    return valid;
}

// shows that input data is not valid. @param el is a btn to change
function showInvalid(el){
    el.classList.add("danger");
    el.innerHTML = "Your input isn't valid";
}

// removes validation error on input click
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

// handles successful return of AJAX request
function success(){
    var msgHost = document.getElementById('response');
    let formWrapper = document.getElementById('form-content');
    let response = JSON.parse(this.responseText);
        
    switch(response.status){
        case 200:
            msgHost.style.backgroundColor = "green"; 
            msgHost.innerHTML = response.msg;
            break;
        case 201:
            msgHost.style.backgroundColor = "green";
            msgHost.innerHTML = response.msg;
            formWrapper.innerHTML = generateForm(response.content);
            break;
        case 300:
            msgHost.innerHTML = `${response.msg}`;
            break;
        case 400:
            msgHost.innerHTML = `${response.msg}`;
            break;
        case 404:
            msgHost.style.backgroundColor = "red";
            msgHost.innerHTML = `No record of stack with id: ${response.id}`;
            formWrapper.innerHTML = generateForm(response.content);
            break;
    }
    
    msgHost.classList = 'response show';
    setTimeout(function(){
        msgHost.classList = "response hide";
    }, 3000);
}