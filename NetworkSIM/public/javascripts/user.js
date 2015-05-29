function removeOptions(selectbox){
	var i;
	for(i=selectbox.options.length-1;i>=0;i--){
		selectbox.remove(i);
	}
}

function networkSelection(networks) {

	var networkSelection = document.getElementById('networkSelect');
	
	removeOptions(networkSelection);
	
	var removeOption = document.createElement('option');
	removeOption.innerHTML = "Select a Network";
	networkSelection.appendChild(removeOption);
	for (var i = 0; i < networks.length; i++) {
		var optionValue = networks[i];
		var removeOption = document.createElement('option');
		removeOption.innerHTML = optionValue;
		removeOption.value = optionValue;
		networkSelection.appendChild(removeOption);
	}
};
		
function appSelection(apps) {

	var selection = document.getElementById('appSelect');

	removeOptions(selection);

	var removeOption = document.createElement('option');
	removeOption.innerHTML = "Select an App";
	selection.appendChild(removeOption);
	
	for (var i = 0; i < apps.length; i++) {
		var optionValue = apps[i];
		var option = document.createElement('option');
		option.innerHTML = optionValue;
		option.value = optionValue;
		selection.appendChild(option);
	}
};

function removeNetworkButtons(){
	var leave = document.getElementById('leave');
	leave.style.display = 'none';
	var join = document.getElementById('join');
	join.style.display = 'none';
	var select = document.getElementById('networkSelect');
	select.style.display = 'none';
}

function removeLeaveButton(){
	var leave = document.getElementById('leave');
	leave.style.display = 'none';
	var join = document.getElementById('join');
	join.style.display = 'block';
	var select = document.getElementById('networkSelect');
	select.style.display = 'block';
	select.selectedIndex = "0";
}
		
function removeJoinButton(){
	var join = document.getElementById('join');
	join.style.display = 'none';
	var select = document.getElementById('networkSelect');
	select.style.display = 'none';
	var leave = document.getElementById('leave');
	leave.style.display = 'block';
}

function removeUnregisterButton(){
	var leave = document.getElementById('unregister');
	leave.style.display = 'none';
	var join = document.getElementById('register');
	join.style.display = 'block';
	var app = document.getElementById('runAppButton');
	app.style.display = 'none';
}
		
function removeRegisterButton(){
	var join = document.getElementById('register');
	join.style.display = 'none';
	var join = document.getElementById('unregister');
	join.style.display = 'block';
	var app = document.getElementById('runAppButton');
	app.style.display = 'block';
}
		
function joinNetworkPost() {
	var currentDev = document.getElementById("currentDevice");
	var network = document.getElementById("networkSelect");
	var dict = {};
	dict["networkInput"] = network.value;
	dict["deviceInput"] = deviceName;
	var json = JSON.stringify(dict);
		
	// async function
	doXHRPost("/admin/joinNetwork", json, function(resp){
		var diction = JSON.parse(resp);
		deviceNetworks = diction["deviceNetworkArray"];
		networkName = diction["networkName"];
		document.getElementById('networkName').value = networkName;
		removeJoinButton();
		redraw();
	});
}

function leaveNetworkPost() {
	var currentDev = document.getElementById("currentDevice");
	var dict = {};
	dict["deviceInput"] = deviceName;
	var json = JSON.stringify(dict);
	// async function
	doXHRPost("/admin/leaveNetwork", json, function(resp){
		deviceNetworks = JSON.parse(resp)["deviceNetworkArray"];
		document.getElementById('networkName').value = "No network";
		removeLeaveButton();
		redraw();
	});
}

function logoutPost() {
	var request = new XMLHttpRequest();
    
    // Anytime a state changes this methond gets called. State 4 means the operation is complete.
    // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest for more information
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200){
            window.location = request.getResponseHeader("Location");
            //var resp = request.responseText;
        }
    };
    
    request.open('POST', "/user/logout", true);
    request.send();
}

function registerPost() {
	var json = null;
	// async function
	doXHRPost("/user/register", json, function(resp){
		var currentDev = JSON.parse(resp);
		deviceName = currentDev["deviceName"];
		networkName = currentDev["networkName"];
		if(networkName === null){
			networkName = "No network";
		}
		document.getElementById("currentDevice").value = deviceName;
		document.getElementById("networkName").value = networkName;
		
		if (networkName === "No network"){
			removeLeaveButton();
		}
		else{
			removeJoinButton();
		}
		
		removeRegisterButton();
	});
}

function unregisterPost() {
	var json = null;
	// async function
	doXHRPost("/user/unregister", json, function(resp){
		document.getElementById("currentDevice").value = "";
		document.getElementById('networkName').value = "Not paired with device";
		deviceName = "No device";
		networkName = "Not paired with device";
		removeUnregisterButton();
		removeNetworkButtons();
	});
}

function runAppPost() {
	var app = document.getElementById("appSelect").value;
	window.location = "/user/" + app;
}

function init(){
	networkSelection(networks);
	appSelection(apps);
	
	document.getElementById('networkName').value = networkName;
	document.getElementById('currentDevice').value = deviceName;
	
	if (networkName === "No network"){
		removeLeaveButton();
	}
	else{
		removeJoinButton();
	}
	
	if (deviceName === "No device"){
		removeUnregisterButton();
		removeNetworkButtons();
		
	}else{
		removeRegisterButton();
	}
};
