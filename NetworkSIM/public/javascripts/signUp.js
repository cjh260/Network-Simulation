function registerPost() {
	var username = document.getElementById("username");
	var password = document.getElementById("password");
	var dict = {};
	dict[username.getAttribute("name")] = username.value;
	dict[password.getAttribute("name")] = password.value;
	var json = JSON.stringify(dict);
	var xmlhttp = new XMLHttpRequest();
	var resp = ""
	// async function
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			resp = xmlhttp.responseText;
		}
	}
	username.value = "";
	password.value = "";
	xmlhttp.open("POST", "/signUp/register", true);
	xmlhttp.setRequestHeader("Content-type", "application/json");
	xmlhttp.send(json);
}