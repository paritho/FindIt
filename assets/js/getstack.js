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
        form = document.getElementById('updatestackdata');

    if(!validate(processForm(form))){
        showInvalid(e.target);
        return;
    }

    let url = `${form.action}${id}`;
    
    xhr.onload = success;
    
    xhr.open(form.method,url,true);
    xhr.send();
}


