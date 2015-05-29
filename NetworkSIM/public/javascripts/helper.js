
// Function to do an XHR post given a post url, data (as a json string) and callback function.
// The callback function gives the response text from the server.
// If you need to do anything with the response, do it within this callback function, as it is asynchronous.
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

function XHRuploadFiles(url, files, callback) {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    
    // Anytime a state changes this methond gets called. State 4 means the operation is complete.
    // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest for more information
    xhr.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200){
            if (callback && typeof callback === 'function') {
            	var resp = request.responseText;
                callback(resp);
            }
        }
    };
    
    xhr.open("POST", url, true);
    xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
   
    for (var i = 0; i < files.length; i++) {
    	formData.append("uploads", files[i]);
	}
    
    xhr.send(formData);
}