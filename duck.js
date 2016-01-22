duck = function (target) {
	return new Duck(target);
};

var allTypes = {
	string: function(s) {
		return typeof s === 'string';
	},
	number: function(n) {
		return typeof n === 'number';
	}
};

function Duck(target){
	this.target = target;
}

Duck.prototype = {
	is : function(type) {
		if (typeof type === 'string') {
			return allTypes[type](this.target);	
		} else {
			return false;
		}
		
	}
};

/**
*	I am going to write many many code here...
*/

module.exports = duck;