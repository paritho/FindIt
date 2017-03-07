'use strict';
// options = {'method':'post', 'action':'update'}


function genUpdateForm(data, options){
    return `
    
    <form id="updatestackdata" name="updatestackdata" 
    action="/api/stacks/" method="post">
            
    <input type="hidden" id="act" value="${options.action}">
    <h2>${options.action == 'update' ? 'Here\'s the info we found':'Stack info not found: please enter'}</h2>
               
    <div id="stack-info" class="">
      <div class="form-group">
        <label for="stackID">Stack Id:</label>
        <div class="readonly form-input" id="vis-Id">${data.id}
        </div>
        <input name="stackID" id="stackID" value="${data.id}" type="hidden">
      </div>
              
       <div class="form-group">
         <label for="startCallNumber">Starts with call number:</label>
         <input class="${options.action == 'update' ? 'readonly' : ''}"
         name="startCallNumber" id="startCallNumber" 
         value="${data.callNumbers ? data.callNumbers.start.full : ''}" type="text" 
         ${options.action == 'input' ? '' : 'readonly="true"'}">
       </div>
              
       <div class="form-group">
         <label for="endCallNumber">Ends with call number:</label>
         <input class="${options.action == 'update' ? 'readonly' : ''}" 
         name="endCallNumber" id="endCallNumber" 
         value="${data.callNumbers ? data.callNumbers.end.full : ''}" type="text"  
         ${options.action == 'input' ? '' : 'readonly="true"'}">
       </div>

                
        <a class="btn ${options.action == 'input' ? "hide":''}" id="update-btn">Update this stack information</a>
        <a href="input.html" class="btn" id="another-btn">Check another stack</a>
                                         
        <button class="btn sub-btn" id="sub-btn" type="submit">Submit</button>
        <a class="btn hide" href="input.html" id="cancel-btn">Cancel</a>    
     
     </div>
    </form>`;
}


module.exports.genUpdateForm = genUpdateForm;