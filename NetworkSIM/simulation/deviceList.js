var Device = require('./device');
var dbhelp = require('./dbHelpers');
var unassignedTokenList = require('./registerMobileDevice');
var iter = require('../helpers/Iterator');

var mongoUtil = require( '../mongoUtil' );


/** THIS SHOULD NOT BE HERE **/
//var counter = require('../rdts/incRDT/counter');

// the list of all devices
var deviceList = function(){
	this.rdtName;
	this.addDevice = function(deviceName, callback) {
		var db = mongoUtil.getDb();
		unassignedTokenList.theUnassignedTokenList.push(deviceName, function(){
			var temp = new Device(deviceName);
			var saveString = JSON.stringify(temp);
			db.collection('devices').insert({_id:deviceName,jsob:saveString}, function (err, result) {
				if (err) {throw err;}
				callback(temp);
			});
			
			dbhelp.previousInfo(function(netDic,devDic){
				db.collection('previousNetworks').update({_id: new Date()}, {_id:new Date(), networkDictionary:netDic, deviceDictionary:devDic},{upsert:true},
			   		  function(err, result){
			    	  	if (err) {throw err;}
			      	  }
			      );
			});
		});
	};
	
	this.getDevice = function(deviceName, callback) {
		var db = mongoUtil.getDb();
		db.collection('devices').findOne({_id:deviceName}, function (err, result) {
				if (result === null) {
					callback(null);
				} else {
					if (err) {throw err;}
					var dev = result.jsob;
					dev = JSON.parse(dev);
					var retDev = new Device(deviceName);
					var rdt;
					if(dev.rdt !== null){
						//dsfs
						var rdtPath = '../rdts/' + 'incRDT' + '/rdtInterface.js'; //need reference to RDT name here
						
						if (rdtPath !== undefined) {
							
							try {
								rdt = require(rdtPath);
							} catch (err) {
								throw new Error('RDT not found');
							}
							try {
								retDev.flag=true;
								var stuff = {stuff: retDev};
								var test = new iter(stuff);
								rdt.init(new iter({}), new iter(stuff));
								retDev.flag=false;
							} catch (err) {
								throw new Error('RDT failed to initialize');
							}
							
						} else {
							
						}
						//sda
						//retDev.rdt.v = dev.rdt.v;
						/** THIS SHOULD NOT BE HERE
						var varDT = new counter();
						varDT.v = dev.rdt.v;
						retDev.rdt = varDT;
						**/
					}
					retDev.setCurrentNetwork(dev.currentNetwork);
					callback(retDev);
				}
			}
		);
	};
	
	this.removeDevice = function(deviceName, callback) {
		var db = mongoUtil.getDb();
		theDeviceList.getDevice(deviceName, function(retDev) {
			if(retDev !== null) {
				if(retDev.currentNetwork !== null){
					retDev.leaveNetwork();
					db.collection('devices').remove({_id:deviceName}, function(err, result){});
					db.collection('unassignedTokens').remove({_id:deviceName}, function(err, res){});
					callback(retDev);
				} else {
					db.collection('devices').remove({_id:deviceName}, function(err, result){});
					db.collection('unassignedTokens').remove({_id:deviceName}, function(err, res){});
					callback(retDev);
				}
			} else{
				callback(null);
			}
		});
	};
	
	this.getIterable = function(callback) {
		var db = mongoUtil.getDb();
		var arr = db.collection('devices').find().sort({_id:1});
		arr.toArray(function(err, documents) {
			var ret = {};
			for (var i = 0; i < documents.length; i++) {
				var arrDev = JSON.parse(documents[i].jsob);
				var temp = new Device(documents[i]._id);
				temp.currentNetwork = arrDev.currentNetwork;
				temp.rdt = arrDev.rdt;
				ret[documents[i]._id] = temp;
			}
			callback(ret);
		});
	};
};

var theDeviceList = module.exports.theDeviceList = new deviceList();
