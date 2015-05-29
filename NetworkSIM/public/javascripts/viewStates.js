var s = null;

function Network(x,y,w,h,fill,name) {
	this.imageObj = new Image();
	this.imageObj.src = "/stylesheets/images/cell-tower.png";
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 1;
	this.h = h || 1;
	this.fill = fill || "FFF000"
	this.name = name || "No name";
	this.displayName = false;
}
	
Network.prototype.draw = function(ctx){
	ctx.rect(this.x,this.y,this.w,this.h);
	ctx.strokeStyle = 'black';
    ctx.stroke();
	ctx.drawImage(this.imageObj, this.x+ .25*this.w, this.y-.25*this.h, this.w/2, this.h/2);
	
	if(this.displayName){
		var font = this.w/5 +"px serif";
		ctx.font = font;
		ctx.textBaseline = "top";
		ctx.fillStyle = 'black';
		ctx.fillText(this.name, this.x + this.w/2, this.y);
	}
}
//Determine if a point is inside the Network's bounds
Network.prototype.contains = function(mx, my) {
	return  (this.x <= mx) && (this.x + this.w >= mx) &&
          	(this.y <= my) && (this.y + this.h >= my);
}

function Device(x,y,w,h,fill,name,network) {
	this.imageObj = new Image();
	this.imageObj.src = "/stylesheets/images/CellPhone.png";
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 1;
	this.h = h || 1;
	this.fill = fill || "FFF000"
	this.name = name || "No name";
	this.network = network || "No network";
	this.displayName = false;
}
	
Device.prototype.draw = function(ctx){
	ctx.drawImage(this.imageObj, this.x, this.y, this.w*1.25, this.h*1.25);
	
	if(this.displayName){
		var font = this.w/2 +"px serif";
		ctx.font = font;
		ctx.textBaseline = "top";
		ctx.fillStyle = 'black';
		ctx.fillText(this.name, this.x + this.w/2, this.y);
	}
}
//Determine if a point is inside the Network's bounds
Device.prototype.contains = function(mx, my) {
	return  (this.x <= mx) && (this.x + this.w >= mx) &&
          	(this.y <= my) && (this.y + this.h >= my);
}

function Link(beginX, beginY, endX, endY, from, to){
	this.beginX = beginX;
	this.beginY = beginY;
	this.endX = endX;
	this.endY = endY;
	this.from = from || '';
	this.to = to || '';
}

Link.prototype.draw = function(ctx){
	ctx.beginPath();
	ctx.moveTo(this.beginX, this.beginY);
	ctx.lineTo(this.endX, this.endY);
	ctx.stroke();
}

// container for right hand side to contain devices
function DeviceContainer(x,y,w,h,r){
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.r = r;
	this.fill = 'grey';
}

DeviceContainer.prototype.draw = function(ctx){
	ctx.beginPath();
	ctx.moveTo(this.x+this.r, this.y);
	ctx.arcTo(this.x+this.w, this.y, this.x+this.w, this.y+this.h, this.r);
	ctx.arcTo(this.x+this.w, this.y+this.h, this.x, this.y+this.h, this.r);
	ctx.arcTo(this.x, this.y+this.h, this.x,this.y, this.r);
	ctx.arcTo(this.x, this.y, this.x+this.w,this.y, this.r);
	ctx.closePath();
	ctx.fillStyle = this.fill;
	ctx.fill();
	var font = this.w/5 +"px serif";
	ctx.font = font;
	ctx.textBaseline = "top";
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText("Devices", this.x + this.w/2, this.y);
	ctx.strokeStyle = 'black';
	ctx.stroke();
}

function CanvasState(canvas) {
	
	this.canvas = canvas;
	this.defaultWidth = 1352;
	this.defaultHeight = 861;
	this.canvas.width = canvasDiv.clientWidth*10.0/10.0;
	this.canvas.height = window.innerHeight*10.0/10.0;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext('2d');
	
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
	    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
	    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
	    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	}
	
	var html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;
	
	this.networkInput = document.createElement('input');
	this.networkInput.name = 'networkInput';
	this.networkInput.type = 'hidden';
	this.deviceInput = document.createElement('input');
	this.deviceInput.name = 'deviceInput';
	this.deviceInput.type = 'hidden';
	this.connectingNetwork = document.createElement('input');
	this.connectingNetwork.name = 'connectingNetwork';
	this.connectingNetwork.type = 'hidden';
	
	this.valid = false; // when set to false, the canvas will redraw everything
	this.networks = [];  // the collection of networks to be drawn
	this.devices = []; // the collection of devices to be drawn
	this.links = []; // the collection of links between networks
	this.dragging = false; // Keep track of when we are dragging
	this.connecting = false; // Keep track of when connecting networks
	this.networkSelect = false; // Keep track of when dragging a network
	this.deviceSelect = false; // Keep track of when dragging a device
	// the current selected object. 
	this.selection = null;
	this.originalX;
	this.originalY;
	this.selectedLink = null;
	this.dragoffx = 0; 
	this.dragoffy = 0;
	 
	// CanvasState
	var myState = this;
	this.container = new DeviceContainer(this.width - this.width/(this.defaultWidth/200), 10, this.width/(this.defaultWidth/200), this.height - 20, 40);
	
	
	this.deviceX = this.container.x + this.width/(this.defaultWidth/5);
	this.deviceY = this.container.y + this.height/(this.defaultHeight/50);
	
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
	
	canvas.addEventListener('mousemove', function(e) {
		var mouse = myState.getMouse(e);
		var mx = mouse.x;
	    var my = mouse.y;
	    var networks = myState.networks;
	    var links = myState.links;
	    
	    var devices = myState.devices;
	    var l = devices.length;
	    for (var i = l-1; i >= 0; i--) {
	    	if (devices[i].contains(mx, my)) {
	    		var mySel = devices[i];
	    		
	    		mySel.displayName = true;
	    	}
	    	else devices[i].displayName = false;
	    }
	    
	    var l = networks.length;
	    for (var i = l-1; i >= 0; i--) {
	    	if (networks[i].contains(mx, my)) {
	    		var mySel = networks[i];
	    		
	    		mySel.displayName = true;
	    	}
	    	else networks[i].displayName = false;
	    }
		myState.valid = false; // we must redraw
	}, true);	  
	  
	this.selectionColor = '#CC0000';
	this.selectionWidth = 2;  
	this.interval = 100;
	setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.createNetwork = function(networkName) {
	var w, h;
	w = this.width/(this.defaultWidth/100);
	h = this.height/(this.defaultHeight/100);
	this.networks.push(new Network(0,0,w,h,'green', networkName));	
	this.positionNetworks();
	this.valid = false;
}

CanvasState.prototype.positionNetworks = function(){
	var l = this.networks.length;
	var r = 300;//this.width/(this.defaultWidth/300);
	for(var i = 0; i < l; i++){
		var x = (this.width)/2 - this.container.w/1.5 + r * Math.cos(2 * Math.PI * i / l);
	    var y = (this.height)/2.5 + r * Math.sin(2 * Math.PI * i / l); 
	    this.networks[i].x = x;
	    this.networks[i].y = y;
	}
}

CanvasState.prototype.createLinks = function(networkConnections){
	var temp;
	var connectingNetName;
	var beginX = 0;
	var beginY = 0; 
	var endX = 0; 
	var endY = 0;
	
	for(var i = 0; i < this.networks.length; i++){
		for(temp in networkConnections[this.networks[i].name]){
			beginX = this.networks[i].x + .5*this.networks[i].w;
			beginY = this.networks[i].y + .5*this.networks[i].h;
			connectingNetName = networkConnections[this.networks[i].name][temp];
			for(var j = 0; j < this.networks.length; j++){
				if(connectingNetName === this.networks[j].name){
					endX = this.networks[j].x + .5*this.networks[i].w;
					endY = this.networks[j].y + .5*this.networks[i].h;
				}
			}
			this.addLink(new Link(beginX, beginY, endX, endY, this.networks[i].name, connectingNetName));
		}
	}
	this.valid = false;
}

CanvasState.prototype.createDevice = function(deviceName, networkName) {
	var w,h;
	w = this.width/(this.defaultWidth/40);
	h = this.height/(this.defaultHeight/40);
	if(networkName !== 'No network'){
		for(var i = 0; i < this.networks.length; i++){
			if(this.networks[i].name === networkName){
				this.devices.push(new Device(this.networks[i].x,this.networks[i].y,w,h, 'lightskyblue',deviceName, networkName));
			}
		}
	}
	else{
		this.devices.push(new Device(this.deviceX,this.deviceY,w,h, 'lightskyblue',deviceName, networkName));
		if(this.deviceX + this.width/(this.defaultWidth/50) <= this.container.x + this.container.w - this.width/(this.defaultWidth/50)){
			this.deviceX += this.width/(this.defaultWidth/50);
		}
		else{
			this.deviceY += this.height/(this.defaultHeight/50);
			this.deviceX = this.container.x + this.width/(this.defaultWidth/5);
		}
	}
	this.valid = false;
}

CanvasState.prototype.addLink = function(nlink){
	this.links.push(nlink);
	this.valid = false;
}

CanvasState.prototype.removeLink = function() {
	this.links.pop();
	this.valid = false;
}

CanvasState.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
}

CanvasState.prototype.draw = function() {
	if(this.canvas.width*10.0 !== canvasDiv.clientWidth *10.0 ||
		this.canvas.height*10.0 !== window.innerHeight *10.0){
			redraw();
		}
	// if our state is invalid, redraw and validate!
	if (!this.valid) {
		this.canvas.width = canvasDiv.clientWidth* 1.0;
		this.canvas.height = window.innerHeight* 1.0;

		var ctx = this.ctx;
	    var networks = this.networks;
	    var devices = this.devices;
	    var links = this.links;
	    var container = this.container;
	    this.clear();
	    
	    container.draw(ctx);
	    
	    // draw all links
	    var l = links.length;
	    for (var i = 0; i < l; i++){
	    	var link = links[i];
	    	
	    	links[i].draw(ctx);
	    }
	    
	    // draw all networks
	    var l = networks.length;
	    for (var i = 0; i < l; i++) {
	    	var network = networks[i];
	    	// We can skip the drawing of elements that have moved off the screen:
	    	if (network.x > this.width || network.y > this.height ||
	    			network.x + network.w < 0 || network.y + network.h < 0) continue;
	    	networks[i].draw(ctx);
	    }
	    
	    // draw all devices
	    var l = devices.length;
	    for (var i = 0; i < l; i++){
	    	var device = devices[i];
	    	// We can skip the drawing of elements that have moved off the screen:
	    	if (device.x > this.width || device.y > this.height ||
	    			device.x + device.w < 0 || device.y + device.h < 0) continue;
	    	devices[i].draw(ctx);
	    }
	    
	    // draw selection
	    // right now this is just a stroke along the edge of the selected network/device
	    if (this.selection != null) {
	    	ctx.strokeStyle = this.selectionColor;
	    	ctx.lineWidth = this.selectionWidth;
	    	var mySel = this.selection;
	    	ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
	    }
	    
	    this.valid = true;
	}
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
CanvasState.prototype.getMouse = function(e) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
	  
	// Compute the total offset
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
	    } while ((element = element.offsetParent));
	}

	// Add offsets
	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;
	  
	// We return a simple javascript object
	return {x: mx, y: my};
}

function redraw(){
	s.canvas = null;

	s = null;
	
	var c = document.getElementById('canvas');
	s = new CanvasState(c);
	
	for(var i = 0; i < networks.length; i++){	
		s.createNetwork(networks[i]);			
	}
	for(var j=0; j < devices.length; j++){
		s.createDevice(devices[j], deviceNetworks[j]);
	}
	// draw connecting on init
	s.createLinks(networkConnections);
}

function viewInit(){
	var c = document.getElementById('canvas');
	var ctx = c.getContext('2d');

	s = new CanvasState(canvas);
	
	for(var i = 0; i < networks.length; i++){	
		s.createNetwork(networks[i]);			
	}
	for(var j=0; j < devices.length; j++){
		s.createDevice(devices[j], deviceNetworks[j]);
	}
	// draw connecting on init
	s.createLinks(networkConnections);
}

function previous(){
	var time = document.getElementById("timeStamp");
	var dict = {};
	dict[time.getAttribute("name")] = time.value;
	var json = JSON.stringify(dict);
	
	doXHRPost("/viewStates/viewTime", json, function(resp){
		state = JSON.parse(resp);
		networks = state.networkList;
		devices = state.deviceList;
		deviceNetworks = state.deviceNetworkList;
		networkConnections = state.networkConnections;
		redraw();
	});
}