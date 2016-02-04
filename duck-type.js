/***************************************************************
* Duck define
****************************************************************/
function Duck(args){
	if(this instanceof Duck) {
		this.values = args;
		if(args.length > 0) {
			this.value = args[0];
		}
	} else {
		return new Duck(Array.prototype.slice.call(arguments));
	}
	
}
Duck.prototype = {
	is : function(type) {
		if(['function','object'].indexOf(typeof type)  < 0) {
			throw Error('only function or object can be type define, now type is ' + type);
		}
		var self = this,
			result = mute(function() {
				if(_isConstructor(type)) {
					return _instanceof(self.value,type);
				} else if(typeof type === 'function') {
					return type(self.value);
				} else if(Duck(type).is(Array)) {
					return Duck(self.value).is(Array) && (function() {
						var i=0, len=type.length;
						if(type.length === 0) {
							return true;
						} else if(type.length === 1) {
							return !self.value.some(function(v){ return !Duck(v).is(type[0]); });
						} else {
							for(i; i<len; i++) {
								if(!Duck(self.value[i]).is(type[i])) {
									return false;
								}
							}
							return true;
						}
					})();
				} else if(Duck(type).is(Object)) {
					return Duck(self.value).is(Object) && (function(){
						var i=0, keys = Object.keys(type), len = keys.length;
						for(i; i<len; i++) {
							if(!Duck(self.value[keys[i]]).is(type[keys[i]])){
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
		var self = this, args = Array.prototype.slice.call(arguments),i=0, len=args.length;
		if(this.values.length !== args.length) {
			return returnHandle(false, self.values, args);
		}

		for(i; i<len; i++) {
			if(!Duck(this.values[i]).is(args[i])) {
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

function _isValiderTypeName(name) {
	return /^[A-Z]\w*$/.test(name);
}

/***************************************************************
* mute and turn off
****************************************************************/
var returnHandle = throwHandler;

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

/****************************************************************
* function of duck
*****************************************************************/

function validator(fn, mocker) {
	fn.__duck_type_mocker__ = mocker;
	return fn;
}

function asPrototype (obj) {
	return function(value) {
		return obj.isPrototypeOf(value);
	};
};

function or() {
	var args = Array.prototype.slice.call(arguments);
	var result = function(value){
		return args.some(function(type){
			return Duck(value).is(type);
		});
	};
	result.__duck_type_mocker__ = function() {
		return mock(args[Math.floor(Math.random() * args.length)]);
	};
	return result;
};


function and(){
	var args = Array.prototype.slice.call(arguments);
	var result = function(value){
		return !args.some(function(type){
			return !Duck(value).is(type);
		});
	};
	result.__duck_type_mocker__ = function() {
		return args.reduce(function(tmp, type) {
			var obj = mock(type);
			Object.keys(obj).forEach(function(key) {
				tmp[key] = obj[key];
			});
			return tmp;
		}, {});
	};
	return result;
};

var undefinedValidator = validator(function(value){
	return value === undefined;
},function() {
	return undefined;
});

var nullValidator = validator(function(value) {
	return value === null;
},function() {
	return null;
});

function optional(type){
	return or(type,undefinedValidator);
};


/***************************************************************
* Mock of Build In.
****************************************************************/
_mock = {
	'String': function() { 
		var alpha = 'abcdefg hijklmn opqrst uvwxyz ABCDEFG HIGKLMN OPQRST UVWXYZ -_123456789 *',i=1; len=Math.floor(Math.random() * 100), result=[];
		for(i; i<len; i++) {
			result.push(alpha[Math.floor(alpha.length * Math.random())]);
		}
		return result.join(''); 
	},
	'Number': function() { return Math.random() * 10000;},
	'Boolean': function() {return Math.random() >= 0.5? true: false;},
	'Date': function() { return new Date((new Date().getTime()) * Math.random());},
	'Object': function() {
		var types = ['String','Number','Boolean','Date','Function','RegExp'];
		return  _mock[types[Math.floor(Math.random() * types.length)]]();
	},
	'Function': function() { return function() {};},
	'Array': function() {
		var result = [],i=0, len=Math.random() * 10;
		for(i; i<len; i++) {
			result.push(_mock['Object']());
		}
		return result;
	},
	'RegExp': function() { return /.*/; }
};

function mock(type) {
	var result = mute(function(){
		if(_isConstructor(type)) {
			return _mock[type.name]?_mock[type.name](): new type();
		} else if(typeof type  === 'function') {
			var mocker = type.__duck_type_mocker__;
			if(typeof mocker === 'function') {
				return mocker();
			} else {
				throw new Error('can not mock type ' + type);
			}
		} else if (Duck(type).is(Array)) {
			if(type.length === 0) {
				return [];
			} else if(type.length === 1) {
				return (function(){
					var len = Math.random() * 10, i=0 , result=[];
					for(i; i<len; i++) {
						result.push(mock(type[0]));
					}
					return result;
				})();
			} else {
				return (function() {
					var result = [], i=0, len=type.length;
					for(i; i<len; i++) {
						result.push(mock(type[i]));
					}
					return result;
				})();
			}
		} else if(Duck(type).is(Object)) {
			return (function(){
				var result = {},keys = Object.keys(type);
				Object.keys(type).forEach(function(key){
					result[key] = mock(type[key]);
				});
				return result;
			})();
		}
	});
	
	return result;
}


/****************************************************************
* namespace 
*****************************************************************/
function namespace () {
	var _duck = function () {
		return new Duck(Array.prototype.slice.call(arguments));
	};

	_duck.type = function (type, define) {
		if(!_isValiderTypeName(type)) {
			throw Error(type + ' is invalider type name');
		}
		_duck[type] = define;
	};

	_duck.bind = function (target) {-
		Object.keys(_duck).filter(_isValiderTypeName).forEach(function(key) {
			if(target[key] === undefined) {
				target[key] = _duck[key];
			} else {
				throw Error('duplicate key found when binding ' + duck + ' to object ' + target + ' , key:' + key);
			}
		});
		return target;
	};

	(function preparedbuildIn(){
		_duck.type('UNDEFINED', undefinedValidator);
		_duck.type('NULL', nullValidator);
	})();

	/****************************************************************
	* function of _duck
	*****************************************************************/
	_duck.mute = mute;
	_duck.validator = validator;
	_duck.asPrototype = asPrototype;
	_duck.or = or;
	_duck.and = and;
	_duck.optional = optional;
	_duck.mock = mock;

	return _duck;
}


exports.namespace = namespace;