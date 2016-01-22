duck = function (target) {
	return new Duck(target);
};

var allTypes = {
	string: function(s) {
		return typeof s === 'string';
	},
	number: function(n) {
		return typeof n === 'number';
	},
	boolean: function(b) {
		return typeof b === 'boolean';
	},
	object: function(o) {
		return typeof o === 'object';
	},
	undefined: function(u) {
		return typeof u === 'undefined';
	}
};

function Duck(target){
	this.target = target;
}


Duck.prototype = {
	is : function(type) {
		if (typeof type === 'string') {
			var validator = allTypes[type];
			if(validator) {
				return validator(this.target);
			} else {
				return false;
			}	
		} else if(typeof type === 'function') {
			return this.target !== undefined && this.target !== null && this.target.constructor === type;
		} else {
			return false;
		}	
	}
};



/**
*	I am going to write many many code here...
*/

module.exports = duck;