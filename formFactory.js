'use strict';

function genUpdateForm(data){
    return `<form id="updatestackdata" name="updatestackdata" action="/api/stacks/" method="post">
                <input type="hidden" id="act" value="update">
                <h2>Here's the info we found</h2>
                <div id="stack-info" class="">
                    <div class="form-group">
                        <label for="stackID">Stack Id:</label>
                        <div class="readonly form-input" id="vis-Id">${data.id}</div>
                        <input name="stackID" id="stackID" value="${data.id}" type="hidden">
                    </div>
                    <div class="form-group">
                        <label for="startCallNumber">Starts with call number:</label>
                        <input class="readonly" name="startCallNumber" id="startCallNumber" value="${data.callNumbers.start.full}" type="text" readonly="true">
                    </div>
                    <div class="form-group">
                        <label for="endCallNumber">Ends with call number:</label>
                        <input class="readonly" name="endCallNumber" id="endCallNumber" value="${data.callNumbers.end.full}" type="text" readonly="true" readonly="true">
                    </div>
                            
                </div>
                        
                <a class="btn" id="update-btn">Update this stack information</a>
                <a href="update.html" class="btn" id="another-btn">Looks good, check another stack</a>
                        
                        
                <button class="btn sub-btn" id="sub-btn" type="submit">Submit</button>
                <a class="btn hide" id="cancel-btn">Cancel</a>
            </form>`;
}

module.exports.genUpdateForm = genUpdateForm;