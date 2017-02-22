'use strict';

let update_btn = document.getElementById('update-btn'),
    another_btn = document.getElementById('another-btn'),
    cancel_btn = document.getElementById('cancel-btn'),
    inputs = document.querySelectorAll('input');
    

update_btn.addEventListener('click', function(){
    inputs.forEach(function(input){
        if(input.getAttribute('id') == "sID") return;
        input.removeAttribute("readonly");
        input.classList = "";
    });
    
    toggleHide(this, another_btn, cancel_btn);    
});

cancel_btn.addEventListener('click', function(){
    inputs.forEach(function(input){
        input.setAttribute('readonly', true);
        input.classList = 'readonly';
    });
    
    toggleHide(this, another_btn, update_btn); 
    
});

