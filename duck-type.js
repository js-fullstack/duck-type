function duck () {
	var d = new Duck(), args = Array.prototype.slice.call(arguments);
	d.values = args;
	if(args.length > 0) {
		d.value = args[0];
	}
	return d;
};

/***************************************************************
* mute and turn off
****************************************************************/
var returnHandle = throwHandler, _turnoff = false;

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

duck.turnoff = function() { _turnoff = true; };

/****************************************************************
* namespace 
*****************************************************************/

function createTypeFunction() {
	return function f(type, define) {
		f[type] = define;
	};
}

function namespace(name) {
	if(!name) {
		this.ns = namespace;
		this.type = createTypeFunction()
		return this;
	} else {
		if(!this[name]) {
			this[name] = {};
		} 
		this[name].ns = namespace;
		this[name].type = createTypeFunction();
		return this[name];
	}
}

namespace.call(duck);

/****************************************************************
* init build-in type for defuault namespace 
*****************************************************************/
(function preparedbuildIn(){
	var _buildIn = {string:String,number:Number,boolean:Boolean, 'object':Object, function: Function, null:Object,'undefined':undefined};
	Object.keys(_buildIn).forEach(function(type) {
		duck.type(type, function(value) {
			return typeof value === type || _instanceof(value, _buildIn[type]);
		});
		duck.type('UNDEFINED', function(value){
			return value === undefined;
		});
		duck.type('NULL', function(value) {
			return value === null;
		});
	});
})();

/****************************************************************
* Duck Object 
*****************************************************************/
function Duck(){}

Duck.prototype = {
	is : function(type) {
		if(_turnoff) { return true;}
		var self = this,
			result = mute(function() {
				if (typeof type === 'string') {
					return duck(self.value).is(duck.type[type]);
				} else if(_isConstructor(type)) {
					return _instanceof(self.value,type);
				} else if(typeof type === 'function') {
					return type(self.value);
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
		if(_turnoff) { return true;}
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

function _instanceof(value, type) {
	return value !== undefined && (new Object(value) instanceof type);
}

function _isConstructor(type) {
	return typeof type === 'function' && type.name;
}

/****************************************************************
* function of duck
*****************************************************************/
duck.asPrototype = function(obj) {
	return function(value) {
		return obj.isPrototypeOf(value);
	};
};

duck.or = function(){
	var args = Array.prototype.slice.call(arguments);
	return function(value){
		return args.some(function(type){
			return duck(value).is(type);
		});
	};
};

duck.and = function(){
	var args = Array.prototype.slice.call(arguments);
	return function(value){
		return !args.some(function(type){
			return !duck(value).is(type);
		});
	};
};

duck.undefinable = function(type){
	return duck.or(type,'undefined');
};


/**
*	I am going to write many many code here...
*/

module.exports = duck;