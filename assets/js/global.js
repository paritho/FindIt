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

function success(){
    var msgHost = document.getElementById('response');
    let response = JSON.parse(this.responseText);
    
    switch(response.status){
        case 200:
            msgHost.innerHTML = `${response.msg} Stack #${response.id} inserted`;
            break;
        case 400:
            msgHost.innerHTML = `${response.msg}`;
            break;
        case 404:
            msgHost.innerHTML = `${response.msg}`;
            break;
        case 418:
            msgHost.innerHTML = `${response.msg}`;
            break;
    }
    
    msgHost.classList = 'response show';
    setTimeout(function(){
        msgHost.classList = "response hide";
    }, 3000);
}