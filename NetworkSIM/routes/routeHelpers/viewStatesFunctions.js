// Requires
var admin = require('../../simulation/admin');
var guid = require('../../helpers/GUID');
var prev = require('../../simulation/dbHelpers');

/* GET FUNCTIONS */
exports.renderViewStates = function(req, res){
	res.render('viewStates', 
			{title: "View States",
			 networkList: req.networkNames,
			 deviceList: req.deviceNames,
			 deviceNetworkList: req.deviceNetworks,
			 networkConnections: req.networkConnections
			}
	);
}

/* POST FUNCTIONS */

//Function for saving states
exports.viewTime = function(req,res, next){
	var date = new Date(req.body.timeStamp);
	prev.getState(date, function(state){
		devtmp= state[1];
		devList = [];
		devConn = [];
		i=0;
		for (var key in devtmp){
			devList[i]=key;
			devConn[i]=devtmp[key];
			i++;
		}
		i=0;
		nettemp = state[0];
		netList = [];
		netConns = nettemp;
		for (var key in nettemp) {
			netList[i]=key;
			i++;
		}
		res.json({networkList:netList, deviceList: devList,
			deviceNetworkList:devConn,networkConnections:netConns});
		res.end()
	});
}