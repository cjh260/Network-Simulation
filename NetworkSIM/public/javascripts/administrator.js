// Javascript file for the admin interface pag
function removeOptions(selectbox){
	var i;
	for(i=selectbox.options.length-1;i>=0;i--){
		selectbox.remove(i);
	}
}

// function for updating drop down boxes that contain networks
function networkSelection() {

	var networkSelection = document.getElementById('selectedNetworkList');
	var connect2Selection = document.getElementById('connect2');
	
	removeOptions(networkSelection);
	removeOptions(connect2Selection);
	
	var removeOption = document.createElement('option');
	removeOption.innerHTML = "Select a Network";
	networkSelection.appendChild(removeOption);
	var connectOption = document.createElement('option');
	connectOption.innerHTML = "Connect to Network";
	connect2Selection.appendChild(connectOption);
	for (var i = 0; i < networks.length; i++) {
		var optionValue = networks[i];
		var removeOption = document.createElement('option');
		var connect2Option = document.createElement('option');
		connect2Option.innerHTML = optionValue;
		connect2Option.value = optionValue;
		removeOption.innerHTML = optionValue;
		removeOption.value = optionValue;
		networkSelection.appendChild(removeOption);
		connect2Selection.appendChild(connect2Option);
	}
};

// function for updating drop down boxes that contain devices
function deviceSelection(){
	
	var selection = document.getElementById('deviceList');
	
	removeOptions(selection);

	var removeOption = document.createElement('option');
	removeOption.innerHTML = "Select a Device";
	selection.appendChild(removeOption);
	
	for (var i = 0; i < devices.length; i++) {
		var optionValue = devices[i];
		var option = document.createElement('option');
		option.innerHTML = optionValue;
		option.value = optionValue;
		selection.appendChild(option);
	}
}

// function for updating the fields under network properties
function networkInfoUpdate() {

	var selectedNetworkName = document.getElementById('netName');
	var selectedNetworkType = document.getElementById('netType');

	selectedNetworkName.value = networkInfo['networkName'];
	selectedNetworkType.value = networkInfo['networkKind'];

};

// function for updating drop down box for list of applications that are
// imported
function appSelection() {

	var selection = document.getElementById('appList');

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

// function for updating drop down box for list of rdts that are imported
function rdtSelection() {

	var selection = document.getElementById('RDTList');
	
	removeOptions(selection);

	var removeOption = document.createElement('option');
	removeOption.innerHTML = "Select an RDT";
	selection.appendChild(removeOption);

	for (var i = 0; i < rdts.length; i++) {
		var optionValue = rdts[i];
		var option = document.createElement('option');
		option.innerHTML = optionValue;
		option.value = optionValue;
		selection.appendChild(option);
	}
};

function addNetworksPost() {
	var numNetworks = document.getElementById("numNetworks");
	var dict = {};
	dict[numNetworks.getAttribute("name")] = numNetworks.value;
	var json = JSON.stringify(dict);
	doXHRPost("/admin/addNetworks", json, function(resp){
		networks = JSON.parse(resp);
		numNetworks.value = "";
		networkSelection();
		redraw();
	});
}

function selectedNetworkPost(select){
	var dict = {};
	dict[select.getAttribute("name")] = select.value;
	var json = JSON.stringify(dict);
	
	doXHRPost("/admin/getNetworkInfo", json, function(resp){
		document.getElementById("netType").value = JSON.parse(resp);
		document.getElementById("netName").value = select.value;
	});
}

function removeNetworkPost(){
	var select = document.getElementById("selectedNetworkList");
	var dict = {};
	dict[select.getAttribute("name")] = select.value;
	var json = JSON.stringify(dict);	
	
	// async function
	doXHRPost("/admin/removeNetwork", json, function(resp){
		document.getElementById("netName").value = "";	
		document.getElementById("netType").value = "";
		var diction = JSON.parse(resp);
		networks = diction["networkArray"];
		networkConnections = diction["networkConnections"];
		select.selectedIndex = 0;
		networkSelection();
		redraw();
	});
}

function removeAllNetworksPost(){
	var json = null;
	// async function
	doXHRPost("/admin/removeAllNetworks", json, function(resp){
		document.getElementById("selectedNetworkList").selectedIndex = 0;	
		document.getElementById("netName").value = "";	
		document.getElementById("netType").value = "";
		var diction = JSON.parse(resp);
		networks = diction["networkArray"];
		networkConnections = diction["networkConnections"];
		networkSelection();
		redraw();
	});
}

function resetDatabasePost(){
	var json = null;
	// async function
	doXHRPost("/admin/resetDatabase", json, function(resp){
		document.getElementById("selectedNetworkList").selectedIndex = 0;	
		document.getElementById("netName").value = "";	
		document.getElementById("netType").value = "";
		networks = [];
		devices = [];
		deviceNetworks = [];
		networkConnections = [];
		apps = [];
		rdts = [];
		networkInfo = [];
		networkSelection();
		deviceSelection();
		appSelection();
		rdtSelection();
		redraw();
	});
}

function connectNetworksPost(connector){
	var select = document.getElementById("selectedNetworkList");
	var dict = {};
	dict[select.getAttribute("name")] = select.value;
	dict[connector.getAttribute("name")] = connector.value;
	var json = JSON.stringify(dict);
	
	document.getElementById("netName").value = "";	
	document.getElementById("netType").value = "";	
	// async function
	doXHRPost("/admin/connectNetworks", json, function(resp){
		networkConnections = JSON.parse(resp);
		select.selectedIndex = 0;
		connector.selectedIndex = 0;
		redraw();
	});
	
}

function editNetworkPost(){
	var select = document.getElementById("selectedNetworkList");
	var name = document.getElementById("netName");
	var type = document.getElementById("netType");
	var dict = {};
	dict[select.getAttribute("name")] = select.value;
	dict[name.getAttribute("name")] = name.value;
	dict[type.getAttribute("name")] = type.value;
	var json = JSON.stringify(dict);

	// async function
	doXHRPost("/admin/editNetwork", json, function(resp){
		var diction = JSON.parse(resp);
		networks = diction["networkArray"];
		networkConnections = diction["networkConnections"];
		deviceNetworks = diction["deviceNetworkArray"]
		select.selectedIndex = 0;
		networkSelection();
		redraw();
		name.value = "";
		type.value = "";
	});
}

function addDevicesPost() {
	var numDevices = document.getElementById("numDevices");
	var dict = {};
	dict[numDevices.getAttribute("name")] = numDevices.value;
	var json = JSON.stringify(dict);	
	// async function
	doXHRPost("/admin/addDevices", json, function(resp){
		var diction = JSON.parse(resp);
		devices = diction["deviceArray"];
		deviceNetworks = diction["deviceNetworkArray"];
		deviceSelection();
		numDevices.value = "";
		redraw();
	});
	
}

function removeDevicePost(){
	var select = document.getElementById("deviceList");
	var dict = {};
	dict[select.getAttribute("name")] = select.value;
	var json = JSON.stringify(dict);
	
	// async function
	doXHRPost("/admin/removeDevice", json, function(resp){
		var diction = JSON.parse(resp);
		devices = diction["deviceArray"];
		deviceNetworks = diction["deviceNetworkArray"];
		select.selectedIndex = 0;
		deviceSelection();
		redraw();
	});
	
}

function removeAllDevicesPost(){
	var json = null;
	// async function
	doXHRPost("/admin/removeAllDevices", json, function(resp){
		var diction = JSON.parse(resp);
		devices = diction["deviceArray"];
		deviceNetworks = diction["deviceNetworkArray"];
		deviceSelection();
		redraw();
	});
}

function importAppPost() {
	var appEle = document.getElementById("appName");
	var appFiles = appEle.files;
	
	XHRuploadFiles('/admin/importApp', appFiles, function(resp) {
		apps = JSON.parse(resp);
		appSelection();
		appEle.value = "";
	});
}

function removeAppPost(){
	var select = document.getElementById("appList");
	var dict = {};
	dict[select.getAttribute("name")] = select.value;
	var json = JSON.stringify(dict);
	
	// async function
	doXHRPost("/admin/removeApp", json, function(resp){
		apps = JSON.parse(resp);
		select.selectedIndex = 0;
		appSelection();
	});
}

function removeAllAppsPost(){
	var json = null;
	// async function
	doXHRPost("/admin/removeAllApps", json, function(resp){
		apps = JSON.parse(resp);
		appsSelection();
	});
}

function importRDTPost() {
	var rdtEle = document.getElementById("rdtName");
	var rdtFiles = rdtEle.files;
	
	XHRuploadFiles('/admin/importRdt', rdtFiles, function(resp) {
		rdts = JSON.parse(resp);
		rdtSelection();
		rdtName.value = "";
	});
}

function useRDTPost(){
	var select = document.getElementById("RDTList");
	var dict = {};
	dict[select.getAttribute("name")] = select.value;
	var json = JSON.stringify(dict);
	
	// async function
	doXHRPost("/admin/useRDT", json, function(resp){
		
	});
}

function removeRDTPost(){
	var select = document.getElementById("RDTList");
	var dict = {};
	dict[select.getAttribute("name")] = select.value;
	var json = JSON.stringify(dict);
	
	// async function
	doXHRPost("/admin/removeRDT", json, function(resp){
		rdts = JSON.parse(resp);
		select.selectedIndex = 0;
		rdtSelection();
	});
}

function removeAllRDTsPost(){
	var json = null;
	// async function
	doXHRPost("/admin/removeAllRDTs", json, function(resp){
		rdts = JSON.parse(resp);
		rdtSelection();
	});
}
// function for when the page loads
function init() {
	
	networkSelection();
	
	deviceSelection();
	appSelection();
	rdtSelection();
	 	
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
