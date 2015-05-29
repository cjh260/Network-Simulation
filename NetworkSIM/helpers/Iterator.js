// Array check
function isArray(candidate) {
    return candidate &&
        typeof candidate === 'object' &&
        typeof candidate.length === 'number' &&
        typeof candidate.splice === 'function' &&
        !(candidate.propertyIsEnumerable('length'));
}

function dontIterate(collection) {
    // put some checks here for stuff that isn't iterable
    return (!collection || typeof collection === 'number' || typeof collection === 'boolean');
}

/**
 * A generic Iterator object
 */
var Iterator = function(collection) {
	
	if (typeof collection==='string') {
		collection = collection.split('');
	}
	
	if (dontIterate(collection)) {
		throw new Error('I won\'t iterate over that ('+collection+')!');
	}
	
	var arr = isArray(collection);
	var idx = 0, top = 0;
	var keys = [];
	
	if (arr) {
		top = collection.length;
	} else {
		for (var prop in collection) {
			keys.push(prop);
		}
	}

	this.first = function() {
		// Return the first element
		this.reset();
		return this.next();
	};

	this.next = function() {
		// Return the next element
		if (!this.hasNext()) {
			throw new Error('I have no more elements.');
		}
		
		var elem = arr ? collection[idx] : collection[keys[idx]];
		
        ++idx;
        
		return elem;
	};

	this.hasNext = function() {
		// Determine if there are more elements to iterate
		return arr ? idx <= top : idx < keys.length;
	};

	this.reset = function() {
		// Reset the iterator to its initial state so it can be re-used
		arr = isArray(collection);
		idx = 0;
		top = 0;
		keys = [];
		
		if (arr) {
			top = collection.length;
		} else {
			for (var prop in collection) {
				keys.push(prop);
			}
		}
	};

	this.each = function(callback) {
		// Invoke the callback function on each element
		for (var item = this.first(); this.hasNext(); item = this.next()) {
			callback(item);
		}
	};
};

module.exports = Iterator;
