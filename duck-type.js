(function() {
	/***************************************************************
     * Schema define
     ****************************************************************/
    function Schema(args){
        if(this instanceof Schema) {
            this.values = args;
            if(args.length > 0) {
                this.value = args[0];
            }
        } else {
            return new Schema(Array.prototype.slice.call(arguments));
        }

    }
    Schema.prototype = {
        is : function(typeDefine, propertiesStack) {
            propertiesStack = propertiesStack || {
                chain:[],
                lastValue:undefined,
                lastType:undefined,
                need: function() {	return this.chain.length > 0; },
                wrap: function(propertyName,type,value, fn) {
                    var result, self = this;
                    self.chain.push(propertyName);
                    self.lastValue = value;
                    self.lastType = type;
                    result = fn();
                    if(result) {
                        self.chain.pop();
                    }
                    return result;
                }
            };
            if(['function','object'].indexOf(typeof typeDefine)  < 0) {
                throw InvalidTypeError('only function or object can be type define, now type is (' + typeof typeDefine + ')');
            }
            var self = this,
                result = mute(function() {
                    if(_isConstructor(typeDefine)) {
                        return _instanceof(self.value,typeDefine);
                    } else if(typeof typeDefine === 'function') {
                        return typeDefine(self.value, propertiesStack);
                    } else if(Schema(typeDefine).is(Array)) {
                        return Schema(self.value).is(Array) && (function() {
                            if(typeDefine.length === 0) {
                                return true;
                            } else if(typeDefine.length === 1) {
                                return self.value.every(function(v,i){
                                    return propertiesStack.wrap('[' + i + ']',typeDefine[0], v, function() {
                                        return Schema(v).is(typeDefine[0],propertiesStack);
                                    });
                                });
                            } else {
                                return typeDefine.every(function(t,i){
                                    return propertiesStack.wrap('[' + i + ']', t, self.value[i], function() {
                                        return Schema(self.value[i]).is(t,propertiesStack);
                                    });
                                });
                            }
                        })();
                    } else if(Schema(typeDefine).is(Object)) {
                        return Schema(self.value).is(Object) &&
                            Object.keys(typeDefine).every(function(key) {
                                return propertiesStack.wrap(key, typeDefine[key], self.value[key], function() {
                                    return Schema(self.value[key]).is(typeDefine[key], propertiesStack);
                                });
                            });
                    } else {
                        return false;
                    }
                });
            return _returnHandle(result, self.value, typeDefine, propertiesStack);
        },

        are : function(){
            var self = this, args = Array.prototype.slice.call(arguments);
            return _returnHandle(self.values.length === args.length && args.every(function(arg,i) {
                return Schema(self.values[i]).is(arg);
            }),self.values, args);
        }
    };

    function _instanceof(value, type) {
        return value !== undefined && (new Object(value) instanceof type);
    }

    function _getFnName(fn) {
        return fn.name || (fn.toString().match(/^\s*function\s*(\S*)\s*\(/)||[,''])[1];
    }

    function _isConstructor(type) {
        return typeof type === 'function' && _getFnName(type) !== '';
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
     * mute and error handler
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

    function _booleanHandler(result) {
        return result;
    }

    function _printableValue(obj) {
        return mute(function() {
            if (obj === undefined) {
                return 'undefined';
            } else if(obj === null) {
                return 'null';
            } else if (Schema(obj).is(or(Number, Date, Boolean,RegExp))) {
                return obj.toString();
            } else if(Schema(obj).is(String)) {
                return '"' + obj + '"';
            } else if (Schema(obj).is(Function)) {
                return 'Function';
            } else if(Schema(obj).is(Array)) {
                return '[' + obj.map(function(o){
                    return _printableValue(o);
                }).join(',') + ']';
            } else if(Schema(obj).is(Object)) {
                return '{ ' + Object.keys(obj).reduce(function(tmp, key){
                    return tmp.concat([key,_printableValue(obj[key])].join(': '));
                },[]).join(', ') + ' }';
            }
        });
    }

    function _printableTypeName(type) {
        if(type.__duck_type_name__) {
            return type.__duck_type_name__;
        } else if(_isConstructor(type)) {
            return type.name;
        } else {
            return '';
        }
    }

    function _printableType(type) {
        return mute(function() {
            if (Schema(type).is(Function)) {
                return type.__duck_type_error__?
                    type.__duck_type_error__(): type.name || type.toString();
            } else if(Schema(type).is(Array)) {
                return '[' + type.map(function(o){
                    return _printableType(o);
                }).join(',') + ']';
            } else if(Schema(type).is(Object)) {
                return '{ ' + Object.keys(type).reduce(function(tmp, key){
                    return tmp.concat([key,_printableType(type[key])].join(': '));
                },[]).join(', ') + ' }';
            }
        });
    }

    function _throwHandler(result, value, type, propertiesStack) {
        if(result === false) {
            var messageArray = [
                propertiesStack.need()?
                    [propertiesStack.chain.join('.').replace(/\.\[/g,'['), _printableValue(propertiesStack.lastValue)].join(': ') :
                    _printableValue(value),
                'is not compatible with',
                (function(type) {
                    return _printableTypeName(type) || _printableType(type);
                })(propertiesStack.need()? propertiesStack.lastType : type)
            ];

            if(!_isConstructor(type)) {
                messageArray = messageArray.concat([
                    ',',
                    'which defined by',
                    _printableTypeName(type) || 'inline validator',
                    ':',
                    _printableType(type,false,true)
                ]);
            }

            throw new IncompatibleTypeError(messageArray.join(' '));
        } else {
            return true;
        }
    }

    /****************************************************************
     * function of duck
     *****************************************************************/

    function validator(fn, generatorHandler, errorHandler) {
        fn.__duck_type_mocker__ = generatorHandler;
        fn.__duck_type_error__ = errorHandler;
        return fn;
    }

    function asPrototype (obj) {
        var result = function(value) {
            return obj.isPrototypeOf(value);
        };
        result.__duck_type_mocker__ = function() {
            return Object.create(obj);
        };

        result.__duck_type_error__ = function() {
            return 'asPrototype(' + _printableValue(obj) + ')';
        };

        return result;
    }

    function or() {
        var args = Array.prototype.slice.call(arguments);
        var result = function(value){
            return args.some(function(type){
                return Schema(value).is(type);
            });
        };
        result.__duck_type_mocker__ = function() {
            return generate(args[_randomInt(args.length)]);
        };

        result.__duck_type_error__ = function() {
            return 'or(' + args.map(function(arg) {
                return _printableType(arg, false, true);
            }).join(', ') + ')';
        };
        return result;
    }


    function and(){
        var args = Array.prototype.slice.call(arguments);
        var result = function(value, propertiesStack){
            return args.every(function(type){
                return Schema(value).is(type,propertiesStack);
            });
        };

        result.__duck_type_mocker__ = function() {
            return args.reduce(function(tmp, type) {
                var obj = generate(type);
                Object.keys(obj).forEach(function(key) {
                    tmp[key] = obj[key];
                });
                return tmp;
            }, {});
        };

        result.__duck_type_error__ = function() {
            return 'and(' + args.map(function(arg) {
                return _printableType(arg);
            }).join(', ') + ')';
        };
        return result;
    }

    var undefinedValidator = validator(function(value){
        return value === undefined;
    }, function() {
        return undefined;
    }, function() {
        return 'UNDEFINED';
    });

    var nullValidator = validator(function(value) {
        return value === null;
    },function() {
        return null;
    },function() {
        return 'NULL';
    });

    function optional(type){
        var result =  or(type,undefinedValidator);
        result.__duck_type_error__ = function() {
            return 'optional(' + _printableType(type) + ')';
        };
        return result;
    }

    function parameterize(fn, mockerHandler, errorHandler) {
        var parameterizeFn =  function() {
            var args = Array.prototype.slice.call(arguments);
            var result =  function(value) {
                return fn.apply(undefined,[value].concat(args));
            };
            if(typeof mockerHandler === 'function') {
                result.__duck_type_mocker__ = function() {
                    return mockerHandler.apply(undefined,args);
                };
            }
            if(typeof errorHandler === 'function') {
                result.__duck_type_error__ = function() {
                    return errorHandler.apply(undefined,args);
                };
            } else {
                result.__duck_type_error__ = function() {
                    return parameterizeFn.__duck_type_name__ + '(' + args.map(function(arg) {
                        return _printableValue(arg);
                    }).join(',') + ')';
                };
            }
            return result;
        };
        return parameterizeFn;
    }

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

    var _generator = {
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
            return  _generator[types[_randomInt(types.length)]]();
        },
        'Function': function() { return function() {};},
        'Array': function() {
            return _times(_randomInt(10)).reduce(function(tmp) {
                return tmp.concat(_generator.Object());
            },[]);
        },
        'RegExp': function() { return /.*/; }
    };

    function generate(type) {
        var result = mute(function(){
            if(_isConstructor(type)) {
                return _generator[type.name]?_generator[type.name](): new type();
            } else if(typeof type  === 'function') {
                if(typeof type.__duck_type_mocker__ === 'function') {
                    return type.__duck_type_mocker__();
                } else {
                    throw new InvalidMockHandlerError('can not mock type ' + type);
                }
            } else if (Schema(type).is(Array)) {
                if(type.length === 0) {
                    return [];
                } else if(type.length === 1) {
                    return (function(){
                        return _times(_randomInt(10)).reduce(function(tmp){
                            return tmp.concat(generate(type[0]));
                        },[]);
                    })();
                } else {
                    return _times(type.length).reduce(function(tmp,i){
                        return tmp.concat(generate(type[i]));
                    },[]);
                }
            } else if(Schema(type).is(Object)) {
                return Object.keys(type).reduce(function(tmp, key){
                    tmp[key] = generate(type[key]);
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
    }

    IncompatibleTypeError.prototype = Error.prototype;


    function InvalidTypeError(message) {
        var result = Error.call(this, message);
        result.name = 'InvalidTypeError';
        return result;
    }

    InvalidTypeError.prototype = Error.prototype;


    function InvalidMockHandlerError(message) {
        var result = Error.call(this, message);
        result.name = 'InvalidMockHandlerError';
        return result;
    }

    InvalidMockHandlerError.prototype = Error.prototype;


    /****************************************************************
     * instance
     *****************************************************************/
    function create() {
        var _domain = function () {
            var typeDefines = Array.prototype.slice.call(arguments);
            return {
                match: function() {
                    var targets = Array.prototype.slice.call(arguments);
                    var _schema = _domain.assert.apply(undefined, targets);
                    return _schema.are.apply(_schema, typeDefines);
                }
            };
        };

        _domain.assert = function () {
            return new Schema(Array.prototype.slice.call(arguments));
        };

        _domain.type = function (type, define) {
            if(!_isValiderTypeName(type)) {
                throw Error(type + ' is invalid type name');
            }

            mute(function() {
                if(_isConstructor(define)) {
                    _domain[type] = define;
                } else if (Schema(define).is(or(Function,Array))) {
                    define.__duck_type_name__ = type;
                    _domain[type] = define;
                } else {
                    _domain[type] = _extend(Object.create({__duck_type_name__ :type}), define);
                }
            });

        };

        _domain.bind = function (target) {
            Object.keys(_domain).filter(_isValiderTypeName).forEach(function(key) {
                if(target[key] === undefined) {
                    target[key] = _domain[key];
                } else {
                    throw Error('duplicate key found when binding  to object ' + target + ' , key:' + key);
                }
            });
            return target;
        };

        (function preparedbuildIn(){
            _domain.type('UNDEFINED', undefinedValidator);
            _domain.type('NULL', nullValidator);
        })();

        /****************************************************************
         * function of domain object
         *****************************************************************/
        _domain.mute = mute;
        _domain.validator = validator;
        _domain.asPrototype = asPrototype;
        _domain.or = or;
        _domain.and = and;
        _domain.optional = optional;
        _domain.generate = generate;
        _domain.parameterize = parameterize;

        _domain.IncompatibleTypeError = IncompatibleTypeError;

        return _domain;
    };


	/**
	* CommonJS module exports
	*/
	if ((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
		module.exports = {
			create: create
		};
	}
	if (typeof exports !== 'undefined') {
		exports.create = create;
	}

	// AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return {
            	create: create
            };
        });
    }

	/**
	* Browser exports
	*/
	if (typeof(window)  !== 'undefined') {
		window['duckType'] = {
			create: create
		};
	}
})();