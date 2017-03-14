'use strict';

function generateForm(options, data){
    switch(options.type){
      case "input":
        return genInputForm(data);
        break;
      case "update":
        return genUpdateForm(data);
        break;
      case "lookup":
        return genLookupForm();
        break;
    }
}

function genUpdateForm(data){
    return `
    <form id="updatestackdata" name="updatestackdata" 
    action="/api/stacks/" method="post">
            
    <input type="hidden" id="act" value="update">
    <h2>Here's the info we found</h2>
               
    <div id="stack-info" class="">
      <div class="form-group">
        <label for="stackID">Stack Id:</label>
        <div class="readonly form-input" id="vis-Id">${data.id}
        </div>
        <input name="stackID" id="stackID" value="${data.id}" type="hidden">
      </div>
              
       <div class="form-group">
         <label for="startCallNumber">Starts with call number:</label>
         <input class="readonly"
         name="startCallNumber" id="startCallNumber" 
         value="${data.callNumbers.start.full}" type="text" 
         readonly="true">
       </div>
              
       <div class="form-group">
         <label for="endCallNumber">Ends with call number:</label>
         <input class="readonly" 
         name="endCallNumber" id="endCallNumber" 
         value="${data.callNumbers.end.full}" type="text"  
         readonly="true">
       </div>

                
        <a class="btn" id="update-btn">Update this stack information</a>
        <a href="input.html" class="btn" id="another-btn">Check another stack</a>
        <a class="btn warning" id="del-btn">Delete this stack</a>
        <button class="btn sub-btn" id="sub-btn" type="submit">Submit</button>
        <a class="btn warning hide" href="input.html" id="cancel-btn">Cancel</a>    
     
     </div>
    </form>`;
}

function genLookupForm(){
  return `
    <form id="stackdata" name="stackdata" action="/api/stacks/" method="get">
            <input type="hidden" id="act" value="input">
            <div class="form-group">
                <label for="stackID">Stack Number</label>
                <input name="stackID" id="stackID" placeholder="Ex: 823" type="text">
            </div>   
      
        <button class="btn sub-btn" id="sub-btn" type="submit">Submit</button>
        </form>`;
}

function genInputForm(data){
  return `
    <form id="updatestackdata" name="updatestackdata" 
    action="/api/stacks/" method="post">
            
    <input type="hidden" id="act" value="input">
    <h2>Stack Info not found. Please enter stack details.</h2>
               
    <div id="stack-info" class="">
      <div class="form-group">
        <label for="stackID">Stack Id:</label>
        <div class="readonly form-input" id="vis-Id">${data.id}
        </div>
        <input name="stackID" id="stackID" value="${data.id}" type="hidden">
      </div>
              
       <div class="form-group">
         <label for="startCallNumber">Starts with call number:</label>
         <input class="" name="startCallNumber" id="startCallNumber" type="text">
       </div>
              
       <div class="form-group">
         <label for="endCallNumber">Ends with call number:</label>
         <input class="" name="endCallNumber" id="endCallNumber" type="text">
       </div>
        
        <a href="input.html" class="btn" id="another-btn">Check another stack</a>
        <button class="btn sub-btn" id="sub-btn" type="submit">Submit</button>
        <a class="btn warning" href="input.html" id="cancel-btn">Cancel</a>    
     
     </div>
    </form>`;
}


module.exports.generateForm = generateForm;