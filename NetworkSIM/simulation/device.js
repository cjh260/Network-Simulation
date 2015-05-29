
var mongoUtil = require( '../mongoUtil' );

// device object
module.exports = function(deviceName) {
	
	// Construct a device object
	this.rdt = null;
	this.flag =false;
	this.name = deviceName;
	this.currentNetwork = null;

	this.getName = function(){
		return this.name;
	};
	
	this.setName = function(deviceName) {
		var db = mongoUtil.getDb();
		//devCol.removeDevice(deviceName);
		var newDev = this;
		this.name = deviceName;
		db.collection('devices').insert({_id:deviceName},JSON.stringify(newDev));
	};
	
	this.getCurrentNetwork = function() {
		return this.currentNetwork;
	};
	
	this.setCurrentNetwork = function(setCurrentNetwork) {
		this.currentNetwork = setCurrentNetwork;
	};
	
	this.joinNetwork = function(network, callback) {
		var db = mongoUtil.getDb();
		// Make the device join a network
		if (this.currentNetwork !== undefined) {
			network.addDevice(this, function() {
				// empty	
			});
			
			this.currentNetwork = network.getName();
			db.collection('devices').update({_id:this.name}, {jsob:JSON.stringify(this)},function (err,res){
					callback();
			});
		
		} else {
			throw new Error('Network does not exist!');
		}
	};

	this.leaveNetwork = function(callback) {
		var db = mongoUtil.getDb();
		// Make the device leave connected network
		this.currentNetwork = null;
		db.collection('devices').update({_id:this.name}, { _id:this.name,jsob:JSON.stringify(this)},function (err,res){
			callback();
		});

	};

	this.getNetwork = function(){
		return this.currentNetwork;
	};
	
	// TODO: not sure why we need this function, but it was given to us initially
	this.returnNetwork = function() {
		// Make the device re-join a previous network
	};
	
	// sets the rdt
	this.replicateRDT = function(replicateRDT) {
		
		var db = mongoUtil.getDb();
		// Register a replicated data type in the device
		this.rdt = replicateRDT;
		
		/*
		if(!this.flag){
			db.collection('devices').update({_id:this.name}, {$set: {jsob:JSON.stringify(this)}},function (err,res){});
		}
		*/
		
	};

	// gets the rdt
	this.accessRDT = function(){
		// Access the previously registered replicated data type in the device
		return this.rdt;
	};

	/** THIS SHOULD NOT BE HERE
	this.incRDT = function(){
		this.rdt.inc();
		devCol.update({_id:this.name}, {$set: {jsob:JSON.stringify(this)}},function (err,res){
			console.log("incRDT: " + this.currentNetwork);
		});
	};
	**/
};