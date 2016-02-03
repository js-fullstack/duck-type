var _turnoff = false;

function turnoff() { _turnoff = true; }
function turnon() { _turnoff = false; }

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

function booleanHandler(_duck, value, type) {
	return _duck;
}

function throwHandler(_duck, value, type) {
	if(_duck === false) {
		throw Error([value,'is not compatible with',type].join(' '));
	} else {
		return true;
	}
}

/***************************************************************
* duck define
****************************************************************/	
var duck = namespace();

function Duck(){}
Duck.prototype = {
	is : function(type) {
		if(_turnoff) { return true;}
		if(['function','object'].indexOf(typeof type)  < 0) {
			throw Error('only function or object can be type define, now type is ' + type);
		}
		var self = this,
			_duck = mute(function() {
				if(_isConstructor(type)) {
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
		return returnHandle(_duck, this.value, type);
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

function _isValiderTypeName(name) {
	return /^[A-Z]\w*$/.test(name);
}



/****************************************************************
* namespace 
*****************************************************************/
function namespace () {
	var _duck = function () {
		var d = new Duck(), args = Array.prototype.slice.call(arguments);
		d.values = args;
		if(args.length > 0) {
			d.value = args[0];
		}
		return d;
	};

	_duck.type = function (type, define) {
		if(!_isValiderTypeName(type)) {
			throw Error(type + ' is invalider type name');
		}
		_duck[type] = define;
	};

	(function preparedbuildIn(){
		_duck.type('UNDEFINED', function(value){
			return value === undefined;
		});
		_duck.type('NULL', function(value) {
			return value === null;
		});
	})();

	/****************************************************************
	* function of duck
	*****************************************************************/
	_duck.mute = mute;

	_duck.asPrototype = function(obj) {
		return function(value) {
			return obj.isPrototypeOf(value);
		};
	};

	_duck.or = function (){
		var args = Array.prototype.slice.call(arguments);
		return function(value){
			return args.some(function(type){
				return duck(value).is(type);
			});
		};
	};

	_duck.and = function(){
		var args = Array.prototype.slice.call(arguments);
		return function(value){
			return !args.some(function(type){
				return !duck(value).is(type);
			});
		};
	};

	_duck.undefinable = function(type){
		return duck.or(type,_duck.UNDEFINED);
	};

	_duck.bind = function (target) {
		Object.keys(_duck).filter(_isValiderTypeName).forEach(function(key) {
			if(target[key] === undefined) {
				target[key] = _duck[key];
			} else {
				throw Error('duplicate key found when binding ' + duck + ' to object ' + target + ' , key:' + key);
			}
		});
		return target;
	};

	return _duck;
}


exports.namespace = namespace;