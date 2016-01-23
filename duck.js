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
function typeDefine(name, define) {
	if(typeof define === 'function') {
		typeDefine[name] = define;	
	} else {
		typeDefine[name] = function() {
			return duck(this.value).is(define);
		}
	}
}

(function initBuildInType() {
	var _buildIn = ['string','number','boolean','object','undefined','function'];

	function validateBuildIn(type) {
		return function() {
			return typeof this.value === type;
		}
	}

	_buildIn.forEach(function(type){
		typeDefine(type,validateBuildIn(type));
	});
})();
duck.type = typeDefine;

/****************************************************************
* Duck Object 
*****************************************************************/
function Duck(){}

Duck.prototype = {
	is : function(type) {
		var self = this;
		if (typeof type === 'string') {
			var validator = duck.type[type];
			if(validator) {
				return validator.call(self);
			} else {
				return false;
			}	
		} else if(typeof type === 'function') {
			if(type.name) {
				return self.value !== undefined && self.value !== null && self.value.constructor === type;
			} else {
				return type.call(self);
			}
		} else if(duck(type).is(Array)) {
			return duck(self.value).is(Array) && (function() {
				var i=0, len=type.length;
				if(type.length === 0) {
					return true;
				} else if(type.length === 1) {
					return !self.value.some(function(v){ return !duck(v).is(type[0]); });
				} else {
					for(i; i<len; i++) {
						if(!duck(self.value[i]).is(type[i])) {
							return false;
						}
					}
					return true;
				}
			})();
		} else if(duck(type).is(Object)) {
			return duck(self.value).is(Object) && (function(){
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