'use strict';

let xhr = new XMLHttpRequest();

// check for valid input while typing
function validate(){
    let inputs = document.querySelectorAll('input');
    for(let input of inputs){
        input.addEventListener('keyup',function(e){
            switch(e.target.id){
                case 'stackID':
                    if(!validateStackID(e.target.value)) showInvalid(input);
                    else removeValidationError(e.target);
                    break;
                case 'startCallNumber':
                case 'endCallNumber':
                    if(!validateCallNumbers(e.target.value)) showInvalid(input)
                    else removeValidationError(e.target);
                    break;
            }
        });
    }
}
validate();

document.getElementById('container').addEventListener('click', function(e){
    let btns = document.querySelectorAll('[id$="-btn"]');
    
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
    let form = document.querySelector('form');

    let formData = processForm(form);
    let path = document.getElementById('stackID').value;
    let url = `${form.action}${path.replace(' ','')}`;
    
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
    let id = document.getElementById('firstSearch').value;
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
// PR6005 .H4 for callnumbers.
function validateCallNumbers(data){
    // TODO: update rgx to allow for cn like pr6003.3 a899
    return /(\w{2})(\d+)(\.\w{1}\d+)/.test(data);
}

// returns true if input is in the form of:
// 1-3 digits for stack id
function validateStackID(stackId){
    return /^[0-9]{1,3}$/.test(stackId);
}

// shows that input data is not valid. @param el is a btn to change
function showInvalid(el){
    el.classList.add("invalid");
    document.getElementById('sub-btn').disabled = true;
}

// removes validation error on input click
function removeValidationError(el){
    el.classList.remove('invalid');
    document.getElementById('sub-btn').disabled = false;
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
            validate();
            break;
        case 300:
            msgHost.innerHTML = `${response.msg}`;
            break;
        case 400:
            msgHost.innerHTML = `${response.msg}`;
            break;
        case 403:
            msgHost.style.backgroundColor = "red";
            msgHost.innerHTML = `Invalid Call Number`;
            formWrapper.innerHTML = generateForm(response.content);
            validate();
            break;
        case 404:
            msgHost.style.backgroundColor = "red";
            msgHost.innerHTML = `No record of stack with id: ${response.id}`;
            formWrapper.innerHTML = generateForm(response.content);
            validate();
            break;
    }
    
    msgHost.classList = 'response show';
    setTimeout(function(){
        msgHost.classList = "response hide";
    }, 3000);
}