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
var returnHandle = throwHandler, _shortcut = false;

function mute(option) {
	var oldHandler = returnHandle, fn;
	if(typeof option === 'function') {
		fn = option;
		returnHandle = booleanHandler;
		try {
			return fn();
		} catch(e) {
			throw e;
		} finally {
			returnHandle = oldHandler;
		}
	} else if(typeof option === 'boolean') {
		returnHandle = option? booleanHandler : throwHandler;
	} else if(option === duck.ALWAYS) {
		_shortcut = true;
	}
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
duck.ALWAYS = {};


/****************************************************************
* Type Collection 
*****************************************************************/
function typeDefine(name, define) {
	typeDefine[name] = define;
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
		if(_shortcut) { return true;}
		var self = this,
			result = mute(function() {
				if (typeof type === 'string') {
					var define = duck.type[type];
					if(typeof define === 'function' && !define.name) {
						return define.call(self);
					} else {
						return duck(self.value).is(define);
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
			});
		return returnHandle(result, this.value, type);
	},

	are : function(){
		if(_shortcut) { return true;}
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