var MongoClient = require( 'mongodb' ).MongoClient;

var _db;

var url = 'mongodb://localhost:27017/group5';

module.exports = {
	connectToServer: function( callback ) {
		MongoClient.connect( url, function( err, db ) {
			_db = db;
			console.log('MongoClient connected to ' + url);
			return callback( err );
		} );
	},

	getDb: function() {
		return _db;
	}
};