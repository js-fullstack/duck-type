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
	is : function(type, propertiesStack) {
		propertiesStack = propertiesStack || {
			chain:[],
			lastValue:undefined, 
			lastType:undefined,
			need: function() {	return this.chain.length > 0; }
		};
		if(['function','object'].indexOf(typeof type)  < 0) {
			throw Error('only function or object can be type define, now type is (' + typeof type + ')');
		}
		var self = this,
			result = mute(function() {
				if(_isConstructor(type)) {
					return _instanceof(self.value,type);
				} else if(typeof type === 'function') {
					return type(self.value);
				} else if(Duck(type).is(Array)) {
					return Duck(self.value).is(Array) && (function() {
						if(type.length === 0) {
							return true;
						} else if(type.length === 1) {
							return self.value.every(function(v,i){
								var result; 
								propertiesStack.chain.push('[' + i + ']');
								propertiesStack.lastValue = v;
								propertiesStack.lastType = type[0];
								result =  Duck(v).is(type[0],propertiesStack); 
								if(result) {
									propertiesStack.chain.pop();
								}
								return result;
							});
						} else {
							return type.every(function(t,i){
								var result; 
								propertiesStack.chain.push('[' + i + ']');
								propertiesStack.lastValue = self.value[i];
								propertiesStack.lastType = t;
								result =  Duck(self.value[i]).is(t,propertiesStack); 
								if(result) {
									propertiesStack.chain.pop();
								}
								return result;
							});
						}
					})();
				} else if(Duck(type).is(Object)) {
					return Duck(self.value).is(Object) &&  
						Object.keys(type).every(function(key) {
							var result;
							propertiesStack.chain.push(key);
							propertiesStack.lastValue = self.value[key];
							propertiesStack.lastType = type[key];
							result = Duck(self.value[key]).is(type[key], propertiesStack);
							if(result) {
								propertiesStack.chain.pop();
							}
							return result;
						});
				} else {
					return false;
				}
			});
		return _returnHandle(result, self.value, type, propertiesStack);
	},

	are : function(){
		var self = this, args = Array.prototype.slice.call(arguments);
		return _returnHandle(self.values.length === args.length && args.every(function(arg,i) {
			return Duck(self.values[i]).is(arg);
		}),self.values, args);
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

function _extend(dest, src) {
	return Object.keys(src).reduce(function(tmp, key){
		tmp[key] = src[key];
		return tmp;
	},dest);
}

/***************************************************************
* mute and turn off
****************************************************************/
var _returnHandle = _throwHandler;

function mute(option) {
	var oldHandler = _returnHandle, fn;
	if(typeof option === 'function') {
		fn = option;
		_returnHandle = _booleanHandler;
		try {
			return fn();
		} catch(e) {
			throw e;
		} finally {
			_returnHandle = oldHandler;
		}
	} else if(typeof option === 'boolean') {
		_returnHandle = option? _booleanHandler : _throwHandler;
	}
}

function _booleanHandler(result, value, type) {
	return result;
}


function _printable(obj, isValue , functionToContent){
	return mute(function() {
		if(obj === undefined) {
			return 'undefined';
		} else if(Duck(obj).is(or(Number,Date,Boolean,RegExp))) {
			return obj.toString();
		} else if(Duck(obj).is(String)) {
			return isValue? '"' + obj + '"' : obj;
		} else if(Duck(obj).is(Function)) {
			return isValue? 'Function':  functionToContent? obj.toString() : obj.name || 'validator function';
		} else if(Duck(obj).is(Array)) {
			return '[' + obj.map(function(o){
				return _printable(o);
			}).join(',') + ']' 
		} else if(Duck(obj).is(Object)) {
			return '{ ' + Object.keys(obj).reduce(function(tmp, key){
				return tmp.concat([key,_printable(obj[key])].join(': '));
			},[]).join(', ') + ' }';
		}
	});
}

function _throwHandler(result, value, type, propertiesStack) {
	if(result === false) {
		var messageArray = [
			propertiesStack.need()? 
				[propertiesStack.chain.join('.').replace(/\.\[/g,'['), _printable(propertiesStack.lastValue,true)].join(': ') :
				_printable(value,true),
			'is not compatible with',
			_printable(propertiesStack.need()? propertiesStack.lastType : type)
		];
		if(!_isConstructor(type)) {
			messageArray = messageArray.concat([
			',',
			'which defined by',
			type.__duck_type_name__? type.__duck_type_name__: 'inline validator',
			':',
			_printable(type,false,true)]);
		}
		throw new IncompatibleTypeError(messageArray.join(' '));
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
	var result = function(value) {
		return obj.isPrototypeOf(value);
	};
	result.__duck_type_mocker__ = function() {
		return Object.create(obj);
	};
	return result;
};

function or() {
	var args = Array.prototype.slice.call(arguments);
	var result = function(value){
		return args.some(function(type){
			return Duck(value).is(type);
		});
	};
	result.__duck_type_mocker__ = function() {
		return mock(args[_randomInt(args.length)]);
	};
	return result;
};


function and(){
	var args = Array.prototype.slice.call(arguments);
	var result = function(value){
		return args.every(function(type){
			return Duck(value).is(type);
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

function parameterize(fn, mockFn) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        var result =  function(value) {
            return fn.apply(undefined,[value].concat(args));
        };
        if(typeof mockFn === 'function') {
            result.__duck_type_mocker__ = function() {
                return mockFn.apply(undefined,args);
            }
        }
        return result;
    };
};

/***************************************************************
* Mock of Build In.
****************************************************************/
function _times(n) {
	var result = [];
	while(n-- > 0) {
		result.push(n);
	}
	return result.reverse();
}

function _randomInt(n) {
	return Math.floor(Math.random() * n);
}

_mock = {
	'String': function() { 
		var alpha = 'abcdefg hijklmn opqrst uvwxyz ABCDEFG HIGKLMN OPQRST UVWXYZ -_123456789 *';
		return _times(_randomInt(100)).reduce(function(tmp,i){
			return tmp.concat(alpha[i]);
		},[]).join('');
	},
	'Number': function() { return (Math.random() - 0.5)* 20000;},
	'Boolean': function() {return Math.random() >= 0.5? true: false;},
	'Date': function() { return new Date(_randomInt(new Date().getTime()));},
	'Object': function() {
		var types = ['String','Number','Boolean','Date','Function','RegExp'];
		return  _mock[types[_randomInt(types.length)]]();
	},
	'Function': function() { return function() {};},
	'Array': function() {
		return _times(_randomInt(10)).reduce(function(tmp) {
			return tmp.concat(_mock.Object());
		},[]);
	},
	'RegExp': function() { return /.*/; }
};

function mock(type) {
	var result = mute(function(){
		if(_isConstructor(type)) {
			return _mock[type.name]?_mock[type.name](): new type();
		} else if(typeof type  === 'function') {
			if(typeof type.__duck_type_mocker__ === 'function') {
				return type.__duck_type_mocker__();
			} else {
				throw new Error('can not mock type ' + type);
			}
		} else if (Duck(type).is(Array)) {
			if(type.length === 0) {
				return [];
			} else if(type.length === 1) {
				return (function(){
					return _times(_randomInt(10)).reduce(function(tmp,i){
						return tmp.concat(mock(type[0]));
					},[]);
				})();
			} else {
				return _times(type.length).reduce(function(tmp,i){
					return tmp.concat(mock(type[i]));
				},[]);
			}
		} else if(Duck(type).is(Object)) {
			return Object.keys(type).reduce(function(tmp, key){
				tmp[key] = mock(type[key]);
				return tmp;
			},{});
		}
	});
	
	return result;
}

/****************************************************************
* Error 
*****************************************************************/
function IncompatibleTypeError(message) {
	var result = Error.call(this, message);
	result.name = 'IncompatibleTypeError';
	return result;
};

IncompatibleTypeError.prototype = Error.prototype;



/****************************************************************
* instance 
*****************************************************************/
function instance () {
	var _duck = function () {
		return new Duck(Array.prototype.slice.call(arguments));
	};

	_duck.type = function (type, define) {
		if(!_isValiderTypeName(type)) {
			throw Error(type + ' is invalider type name');
		}

		mute(function() {
			if(Duck(define).is(or(Function,Array))) {
				define.__duck_type_name__ = type;
				_duck[type] = define;
			} else {
				_duck[type] = _extend(Object.create({__duck_type_name__ :type}), define);
			}
		});
		
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
	_duck.parameterize = parameterize;

	_duck.IncompatibleTypeError = IncompatibleTypeError;

	return _duck;
}

exports.instance = instance;