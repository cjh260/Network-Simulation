var iterator = require('../helpers/Iterator');
var log = require('../simulation/activityLogging');
var deviceList = require('./deviceList');
var networkList = require('./networkList');
var mongoUtil = require( '../mongoUtil' );

// network object
module.exports = function(networkName, networkKind) {
	// Construct a network object
	this.name = networkName; // String
	this.kind = networkKind; // Constant: WiFi, GSM
	this.networkDeviceList = {}; // the list of all devices on this network
	this.deviceIterator = new iterator(this.networkDeviceList); // Returns an iterator that provides Device objects
	this.connectedNetworks = [];
	
	this.addDevice = function(device, callback) {
		var db = mongoUtil.getDb();
		// Adds a device object to the network
		if (device !== undefined) {
			this.networkDeviceList[device.getName()] = device;

			// logs adding device to network
			log.addTimeLog("Device " + device.getName() + " joined " + this.name);
			
			db.collection('networks').update({_id:this.name}, {jsob:JSON.stringify(this)},function (err,res){
				callback();
			});
		} else {
			throw new Error('Device does not exist!');
		}
	};

	this.getDeviceByName = function(deviceName) {
		return this.networkDeviceList[deviceName];
	};
	
	this.getIterator = function() {
		return this.deviceIterator;
	};
	
	this.setIterator = function(setIterator) {
		this.deviceIterator = setIterator;
	};
	
	this.getDevices = function() {
		return this.networkDeviceList;
	};
	
	this.setDevices = function(setDevices) {
		this.networkDeviceList = setDevices;
	};
	
	this.getName = function() {
		return this.name;
	};
	
	this.setName = function(netName){
		this.name = netName;
	};
	
	this.getKind = function(){
		return this.kind;
	};
	
	this.setKind = function(netKind){
		this.kind = netKind;
	};
	
	this.getConnections = function() {
		return this.connectedNetworks;
	};
	
	this.setConnections = function(connections) {
		this.connectedNetworks = connections;
	};
	
	this.removeDevice = function(deviceName, callback) {
		var db = mongoUtil.getDb();
		// log removing device from network 
		delete this.networkDeviceList[deviceName];
		var thisstring = JSON.stringify(this);
		deviceList.theDeviceList.getDevice(deviceName, function(device){
			device.leaveNetwork(function() {
				log.addTimeLog("Device " + deviceName + " left " + this.name);
			});
			db.collection('networks').update({_id:this.name}, {$set: {jsob:thisstring}},function (err,res){
				callback();
			});
		});
		
	};

	this.deleteSelf = function(callback) {
		var db = mongoUtil.getDb();
		for (var key in this.networkDeviceList) {
			//console.log(key);
			this.removeDevice(key, function (){});
		}
		var connets = this.connectedNetworks;
		var thisnet = this;
		db.collection('networks').remove({_id:this.name}, function(err,res){
			if(connets.length>0){
				thisnet.disconnectLast(connets,thisnet,callback);
			} else {
				callback();
			}
		});
	};
	
	this.disconnectLast = function(connets,thisnet,callback){
		if(connets.length>0){
			networkList.theNetworkList.getNetwork(connets.pop(), function(net){
				if (net!==null){
					net.leaveNetwork(thisnet.name, function(){
						thisnet.disconnectLast(connets,thisnet,callback);
					});
				}
			});
		} else {
			callback();
		}
	}
	
	this.connectNetwork = function(networkName, callback) {
		var db = mongoUtil.getDb();
		// Connect the network to another
		this.connectedNetworks.push(networkName);
		db.collection('networks').update({_id:this.name}, {$set: {jsob:JSON.stringify(this)}},function (err,res){
			callback();
		});
	};
	
	this.connectionEdit = function(i,oldName, newName,thisnet,callback){
		var db = mongoUtil.getDb();

		var names = [];
		var temp = [];
		for (var key in this.networkDeviceList){
			names.push(key);
			temp.push(this.networkDeviceList[key]);
		}
		if(i<thisnet.connectedNetworks.length){
			networkList.theNetworkList.getNetwork({_id:thisnet.connectedNetworks[i]}, function(net){
				if(net!=null){
					for(var i=0;i<net.connectedNetworks.length;i++){
						if(tnet.connectedNetworks[i]===oldName){
							tnet.connectedNetworks[i]=newName;
						}
					}
				
					db.collection('networks').update({_id:net.name}, {$set: {jsob:JSON.stringify(net)}},function (err,res){
						thisnet.connectionEdit(i+1,oldName,newName,thisnet,callback);
					});
				}
			});
		} else {
			thisnet.deviceMove(0,newName,names,thisnet,callback);
		}
	};
	
	this.deviceMove = function(i,netName,names,net,callback){
		if(i<names.length){
			deviceList.theDeviceList.getDevice(names[i], function(dev){
				dev.joinNetwork(net, function(){net.deviceMove(i++,netName,names,net,callback)} );
			});
		} else {
			callback();
		}
	}
	
	this.editNetwork = function(newName, newType, callback) {
		var db = mongoUtil.getDb();
		var old = this.name;
		this.name = newName;
		var thisstring = JSON.stringify(this);
		var thisnet = this;
		this.kind= newType;
		db.collection('networks').remove({_id:old}, function(){
			db.collection('networks').insert({_id:newName, jsob:thisstring}, function(){
				thisnet.connectionEdit(0,newName,old,thisnet,callback);
			});
		});
	};

	this.disconnectNetwork = function(networkName, callback) {
		var db = mongoUtil.getDb();
		// Disconnect the network from another
		var index = this.connectedNetworks.indexOf(networkName);

		if(index !== -1) {
			this.connectedNetworks.splice(index, 1);
		}
		var thisstring =JSON.stringify(this);
		networkList.theNetworkList.getNetwork(networkName, function(net){
			db.collection('networks').update({_id:this.name}, {$set: {jsob:thisstring}},function (err,res){
				callback();
			});
			if(net!==null&&net!==undefined){
				net.leaveNetwork(this.name, function(){});
			}
		});
	};
	
	this.leaveNetwork = function(networkName,callback){
		var db = mongoUtil.getDb();
		// Disconnect the network from another
		var index = this.connectedNetworks.indexOf(networkName);

		if(index !== -1) {
			this.connectedNetworks.splice(index, 1);
		}
		db.collection('networks').update({_id:this.name}, {$set: {jsob:JSON.stringify(this)}},function (err,res){
			callback();
		});
	};
};
