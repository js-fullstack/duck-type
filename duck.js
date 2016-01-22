function duck () {
	var d = new Duck(), args = Array.prototype.slice.call(arguments);
	d.values = args;
	if(args.length > 0) {
		d.value = args[0];
	}
	return d;
};

var _buildIn = ['string','number','boolean','object','undefined','function'];

function testBuildIn(type) {
	return function() {
		return typeof this.value === type;
	}
}

var _allTypes = {};

_buildIn.forEach(function(type){
	_allTypes[type] = testBuildIn(type);
})

function Duck(){}

Duck.prototype = {
	is : function(type) {
		if (typeof type === 'string') {
			var validator = _allTypes[type];
			if(validator) {
				return validator.call(this);
			} else {
				return false;
			}	
		} else if(typeof type === 'function') {
			if(type.name) {
				return this.value !== undefined && this.value !== null && this.value.constructor === type;
			} else {
				return type.call(this);
			}
		} else if(duck(type).is(Object)) {
			if(Object.keys(type).length === 0) {
				return duck(this.value).is(Object);
			} else {
				return duck(this.value).is(Object) && (function(){
					var i=0, keys = Object.keys(type).length, len = keys.length;
					for(i; i++; i<len) {
						if(!duck(this.value[keys[i]]).is(type[keys[i]])){
							return false;
						};
					}
					return true;
				})();
			}
		} else {
			return false;
		}	
	},

	are : function(){
		var args = Array.prototype.slice.call(arguments),i=0, len=args.length;
		if(this.values.length !== args.length) {
			return false;
		}

		for(i; i<len; i++) {
			if(!duck(this.values[i]).is(args[i])) {
				return false;
			}
		}
		return true;
	}
};



/**
*	I am going to write many many code here...
*/

module.exports = duck;