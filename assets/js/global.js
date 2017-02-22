function processForm(form){
    let inputs = form.querySelectorAll('input');
    let result = {};
    
    for(let input of inputs) result[input.id] = input.value;   
    
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

// arguments should be html elements which need to be toggled
function toggleHide(){
    for(let arg of arguments) arg.classList.toggle('hide');
}