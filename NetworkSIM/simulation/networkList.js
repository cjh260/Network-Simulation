var Network = require('./network');
var dbhelp = require('./dbHelpers');

var mongoUtil = require( '../mongoUtil' );

// the list of all networks
var networkList = function() {
	
	this.addNetwork = function(networkName, networkKind, callback) {
		var temp = new Network(networkName, networkKind);
		var saveString = JSON.stringify(temp);
		var db = mongoUtil.getDb();
		db.collection('networks').insert({_id:networkName, jsob:saveString},
			function (err, result) {
				if (err) {throw err;}
				callback(temp);
			}
		);
		
	};
	
	
	this.getNetwork = function(netName, callback) {
		var db = mongoUtil.getDb();
		db.collection('networks').findOne({_id:netName}, function (err, result) {
			if (err) {throw err;}
			if (result === null) {
				callback(null);
			} else {
				var net = result.jsob;
				net = JSON.parse(net);
				var retNet = new Network(netName, net.kind);
				retNet.setDevices(net.networkDeviceList);
				retNet.setIterator(net.deviceIterator);
				retNet.setConnections(net.connectedNetworks);
				callback(retNet);
			}
		});
	};
	
	this.getIterable = function(callback) {
		var db = mongoUtil.getDb();
		var arr = db.collection('networks').find().sort({_id:1});
		arr.toArray(function(err, documents) {
			var ret = {};
			for (var i = 0; i < documents.length; i++) {
				var netDev = JSON.parse(documents[i].jsob);
				var retNet = new Network(netDev.name, netDev.kind);
				retNet.setDevices(netDev.networkDeviceList);
				retNet.setIterator(netDev.deviceIterator);
				retNet.setConnections(netDev.connectedNetworks);
				ret[documents[i]._id] = retNet;
			}
			callback(ret);
		});
	};
	
	this.removeNetwork = function(networkName, callback){
		theNetworkList.getNetwork(networkName,function(net){
			if (net !== null) {
				net.deleteSelf(function(){
					callback(net);
				});
			} else {
				callback(null);
			}
		});
	};
	
	this.editNetwork = function(oldName, newName, newType, callback) {
		theNetworkList.removeNetwork(oldName, function(net) {
			theNetworkList.addNetwork(newName, newType, callback);
		});
	};
};

var theNetworkList = module.exports.theNetworkList = new networkList();
