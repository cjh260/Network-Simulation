// Javascript file for the login page

// function for filling textarea
function addTimeLogs(timeLogs){
	
	var textarea = document.getElementById('timeLogArea');
	
	for(var i = 0; i < timeLogs.length; i++){
		var log = timeLogs[i];
		textarea.value = textarea.value + log + '\n' + '\n';
		textarea.scrollTop = textarea.scrollHeight;
	}
}

//function for when the page loads
function init() {
	addTimeLogs(timeLogs);
};

window.onload = init;