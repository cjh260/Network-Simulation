function signUpPost() {
	var username = document.getElementById("username");
	var password = document.getElementById("password");
	var dict = {};
	dict[username.getAttribute("name")] = username.value;
	dict[password.getAttribute("name")] = password.value;
	var json = JSON.stringify(dict);
	// async function
	doXHRPost("/signUp", json, function(resp){
        var alertMessage = JSON.parse(resp);
		Alert.render(alertMessage);
	});
}

function loginPost() {
	var loginName = document.getElementById("loginName");
	var loginPassword = document.getElementById("loginPassword");
	var dict = {};
	dict[loginName.getAttribute("name")] = loginName.value;
	dict[loginPassword.getAttribute("name")] = loginPassword.value
	var json = JSON.stringify(dict);

    var request = new XMLHttpRequest();
    
    // Anytime a state changes this methond gets called. State 4 means the operation is complete.
    // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest for more information
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200){
            window.location = request.getResponseHeader("Location");
            var resp = request.responseText;
        }
    };
    request.open('POST', "/login", true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(json);
}

function createAdminPost() {
	var json = null;
	// async function
	doXHRPost("/createAdmin", json, function(resp){

	});
}

function CustomAlert(){
    this.render = function(dialog){
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH+"px";
        dialogbox.style.left = (winW/2) - (550 * .5)+"px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = "Acknowledge This Message";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = '<input class="inputButton" style="opacity: 1;" readonly value="Ok" onclick="Alert.ok()">';
    }
	this.ok = function(){
		document.getElementById('dialogbox').style.display = "none";
		document.getElementById('dialogoverlay').style.display = "none";
	}
}

var Alert = new CustomAlert();
