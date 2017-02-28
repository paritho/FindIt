'use strict';

let update_btn = document.getElementById('update-btn'),
    another_btn = document.getElementById('another-btn'),
    cancel_btn = document.getElementById('cancel-btn'),
    sub_btn = document.getElementById('sub-btn'),
    inputs = document.querySelectorAll('input');
    

let xhr = new XMLHttpRequest();

if(update_btn){
    update_btn.addEventListener('click', function(){
        inputs.forEach(function(input){
            if(input.getAttribute('id') == "sID") return;
            input.removeAttribute("readonly");
            input.classList = "";
        });

        toggleHide(this, another_btn, cancel_btn);    
    });
}

if(cancel_btn){
    cancel_btn.addEventListener('click', function(){
        inputs.forEach(function(input){
            input.setAttribute('readonly', true);
            input.classList = 'readonly';
        });

        toggleHide(this, another_btn, update_btn); 

    });
}

sub_btn.addEventListener('click', function(e){
    e.preventDefault();
    let id = document.getElementById('stackID').value,
        form = document.getElementById('updatestackdata');
    
    let url = `${form.action}${id}`;
    
    xhr.onload = success;
    
    xhr.open(form.method,url,true);
    xhr.send();
    
});

function replaceForm(){
    // put form for updating the found stack 

}

