function incrementPost(){
	// async function
	doXHRPost("/user/counterApp/increment", null, function(resp){
		document.getElementById("localCount").value = JSON.parse(resp);
	});
}
function doXHRPost(url, json, callback) {
	
    var request = new XMLHttpRequest();
    
    // Anytime a state changes this methond gets called. State 4 means the operation is complete.
    // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest for more information
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200){
            if (callback && typeof callback === 'function') {
            	var resp = request.responseText;
                callback(resp);
            }
        }
    };
    
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(json);
}