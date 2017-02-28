var form = `<form id="updatestackdata" name="updatestackdata" action="/api/stacks/${stackID}" method="post">
    <h2>Here's the info we found</h2>
    <div id="stack-info" class="">
        <div class="form-group">
            <label for="stackID">Stack Id:</label>
            <input class="readonly" name="sID" id="sID" value="${stackID}" type="text" readonly="true">
        </div>
        <div class="form-group">
            <label for="stcn">Starts with call number:</label>
            <input class="readonly" name="stcn" id="stcn" value="${callNumbers.start.full}" type="text" readonly="true">
        </div>
        <div class="form-group">
            <label for="edcn">Ends with call number:</label>
            <input class="readonly" name="edcn" id="edcn" value="${callNumbers.end.full}" type="text" readonly="true" readonly="true">
        </div>
                
    </div>
            
    <a class="btn" id="update-btn">Update this stack information</a>
    <a class="btn" id="another-btn">Looks good, check another stack</a>
            
            
    <button class="btn sub-btn" id="sub-btn" type="submit">Submit</button>
    <a class="btn hide" id="cancel-btn">Cancel</a>
</form>`;