function duck () {
	var d = new Duck(), args = Array.prototype.slice.call(arguments);
	d.values = args;
	if(args.length > 0) {
		d.value = args[0];
	}
	return d;
};

/***************************************************************
* mute with return handle
****************************************************************/
var returnHandle = throwHandler;

function mute(fn) {
	return function() {
		var args = Array.prototype.slice.call(arguments), self = this ,oldHandler = returnHandle;
		returnHandle = booleanHandler;
		try {
			return fn.apply(self, args);
		} catch(e) {
			throw e;
		} finally {
			returnHandle = oldHandler;
		}
	};
}

function booleanHandler(result, value, type) {
	return result;
}

function throwHandler(result, value, type) {
	if(result === false) {
		throw Error([value,'is not compatible with',type].join(' '));
	} else {
		return true;
	}
}

duck.mute = mute;


/****************************************************************
* Type Collection 
*****************************************************************/
function typeDefine(name, define) {
	if(typeof define === 'function' && !define.name) {
		typeDefine[name] = mute(define);
	} else {
		typeDefine[name] = mute(function() {
			return duck(this.value).is(define);
		});
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
				return returnHandle(validator.call(self), self.value, type);
			} else {
				return returnHandle(false, self.value, type);
			}	
		} else if(typeof type === 'function') {
			if(type.name) {
				return returnHandle(self.value !== undefined && self.value !== null && self.value.constructor === type,
					self.value, type.name);
			} else {
				return returnHandle(type.call(self), self.value, type.toString());
			}
		} else if(duck(type).is(Array)) {
			return duck(self.value).is(Array) && (function() {
				var i=0, len=type.length;
				if(type.length === 0) {
					return returnHandle(true, self.value, '[]');
				} else if(type.length === 1) {
					return returnHandle(!self.value.some(function(v){ return !duck(v).is(type[0]); }), self.value, ['[',type[0],']'].join(''));
				} else {
					for(i; i<len; i++) {
						if(!duck(self.value[i]).is(type[i])) {
							return returnHandle(false, self.value, type);
						}
					}
					return returnHandle(true, self.value, type);
				}
			})();
		} else if(duck(type).is(Object)) {
			return duck(self.value).is(Object) && (function(){
				var i=0, keys = Object.keys(type), len = keys.length;
				for(i; i<len; i++) {
					if(!duck(self.value[keys[i]]).is(type[keys[i]])){
						return returnHandle(false, self.value, type);
					};
				}
				return returnHandle(true, self.value, type);
			})();
		} else {
			return returnHandle(false, self.value, type);
		}	
	},

	are : function(){
		var self = this, args = Array.prototype.slice.call(arguments),i=0, len=args.length;
		if(this.values.length !== args.length) {
			return returnHandle(false, self.values, args);
		}

		for(i; i<len; i++) {
			if(!duck(this.values[i]).is(args[i])) {
				return returnHandle(false, self.values, args);;
			}
		}
		return returnHandle(true, self.values, args);
	}
};




/**
*	I am going to write many many code here...
*/

module.exports = duck;