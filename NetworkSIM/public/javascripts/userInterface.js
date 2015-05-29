// Javascript file for the userInterface page

// Local Counter
var localCount = 0;

// Handler for increment button
function incrementButtonCounter(){
	localCount = localCount + 1;
	var localCounter = document.getElementById("localCounter");
	localCounter.innerHTML = localCount;
};

// Handler for page loading
function init(){
	var incrementButton = document.getElementById("incrementButton");
	incrementButton.onclick = incrementButtonCounter; 
};

window.onload = init;