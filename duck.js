function duck () {
	var d = new Duck(), args = Array.prototype.slice.call(arguments);
	d.values = args;
	if(args.length > 0) {
		d.value = args[0];
	}
	return d;
};

/****************************************************************
* Type Collection 
*****************************************************************/
duck.type = function(name, define) {
	if(typeof define === 'function') {
		duck.type[name] = define;	
	} else {
		duck.type[name] = function() {
			return duck(this.value).is(define);
		}
	}
}

var _buildIn = ['string','number','boolean','object','undefined','function'];

function validateBuildIn(type) {
	return function() {
		return typeof this.value === type;
	}
}

_buildIn.forEach(function(type){
	duck.type(type,validateBuildIn(type));
})

/****************************************************************
* Duck Object 
*****************************************************************/
function Duck(){}

Duck.prototype = {
	is : function(type) {
		if (typeof type === 'string') {
			var validator = duck.type[type];
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
			var self = this;
			return duck(this.value).is(Object) && (function(){
				var i=0, keys = Object.keys(type), len = keys.length;
				for(i; i<len; i++) {
					if(!duck(self.value[keys[i]]).is(type[keys[i]])){
						return false;
					};
				}
				return true;
			})();
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