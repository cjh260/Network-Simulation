var express = require('express');
var router = express.Router();

/* GET */
router.get('/', function(req, res) {
	// device needs an rdt to do this
	// need a check here for that
	res.render('index', { title: 'Counter App' });
	
	// for testing
	//res.render('index');
});

router.post('/increment', function(req, res) {
	// need a check here to make sure there is a rdt
	
	req.userDeviceObject.accessRDT().inc();
	console.log(req.userDeviceObject.accessRDT().val());
	res.json(req.userDeviceObject.accessRDT().val());
	res.end();
});

module.exports = router;