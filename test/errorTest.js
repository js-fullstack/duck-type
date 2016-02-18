var assert = require('assert');
var duck = require('../duck-type').instance();


describe('Error test', function() {
    describe('Error Type', function () {
        it('should throw  Error', function () {
            try{
            	duck(1).is(String)
            } catch(e) {
            	assert(duck(e).is(Error));
            }
        });

        it('should throw  IncompatibleTypeError', function () {
            try{
            	duck(1).is(String)
            } catch(e) {
            	assert(duck(e).is(duck.IncompatibleTypeError));
            }
        });

        it('IncompatibleTypeError should have normal properties of Error', function () {
            try{
            	duck(1).is(String)
            } catch(e) {
            	assert(duck(e).is({
            		name: String,
            		message: String,
            		stack: String
            	}));
            }
        });

        it('IncompatibleTypeError name should be "IncompatibleTypeError"', function () {
            try{
            	duck(1).is(String)
            } catch(e) {
            	assert.equal(e.name, 'IncompatibleTypeError');
            }
        });

    });

	describe('error message', function() {
        it('value and type should be display in error message', function () {
            try{
            	duck(1).is(String);
            } catch(e) {
            	assert.equal(e.message, '1 is not compatible with String');
            }
        });

        it('value and type should be display in error message, Number', function () {
            try{
            	duck('1').is(Number);
            } catch(e) {
            	assert.equal(e.message, '"1" is not compatible with Number');
            }
        });

        it('value and type should be display in error message, Function', function () {
            try{
            	duck('1').is(Function);
            } catch(e) {
            	assert.equal(e.message, '"1" is not compatible with Function');
            }
        });

       it('value and type should be display in error message, Number', function () {
            try{
            	duck(function(){}).is(Number);
            } catch(e) {
            	assert.equal(e.message, 'Function is not compatible with Number');
            }
        });

        it('validation function will shown if inline validation function', function() {
        	try{
		        duck(1).is(function() { return false;});
		    } catch(e) {
		        assert.equal(e.message, '1 is not compatible with validator function , which defined by inline validator : function () { return false;}');
		    }
        });

        it('name of type will shown if test type function', function() {
        	try{
        		duck.type('MyType', function() {
        			return false;
        		});
		        duck(1).is(duck.MyType);
		    } catch(e) {
		        assert.equal(e.message, '1 is not compatible with validator function , which defined by MyType : function () {\r\n        \t\t\treturn false;\r\n        \t\t}');
		    }
        });
	});

	describe('object error message:',function(){
		it('object definiation will shown in error message if inline {}', function() {
        	try{
		        duck({name: 123 }).is({name: String});
		    } catch(e) {
		        assert.equal(e.message, 'name: 123 is not compatible with String , which defined by inline validator : { name: String }');
		    }
        });

        it('string, object definiation will shown in error message if inline {}', function() {
        	try{
		        duck({age: '123' }).is({age: Number});
		    } catch(e) {
		        assert.equal(e.message, 'age: "123" is not compatible with Number , which defined by inline validator : { age: Number }');
		    }
        });

        it('nest object definiation will shown in error message if inline {}', function() {
        	try{
		        duck({xx:'hello'}).is({name:{
		        	first: String,
		        	last:String
		        }});
		    } catch(e) {
		        assert.equal(e.message, 'name: undefined is not compatible with { first: String, last: String } , which defined by inline validator : { name: { first: String, last: String } }');
		    }
        });

        it('nest object definiation will shown in error message if inline {}', function() {
        	try{
		        duck({name:{
		        	first: 'foo',
		        	last:123
		        }}).is({name:{
		        	first: String,
		        	last:String
		        }});
		    } catch(e) {
		        assert.equal(e.message, 'name.last: 123 is not compatible with String , which defined by inline validator : { name: { first: String, last: String } }');
		    }
        });

       it('type name will shown if test type function', function() {
        	try{
        		duck.type('Person',{
        			name: String
        		});
		        duck({name:123}).is(duck.Person);
		     } catch(e) {
		         assert.equal(e.message, 'name: 123 is not compatible with String , which defined by Person : { name: String }');
		     }
        });

        it('Function properties will shown if test type function', function() {
        	try{
        		duck.type('Person',{
        			name: Function
        		});
		        duck({name:123}).is(duck.Person);
		     } catch(e) {
 			    assert.equal(e.message, 'name: 123 is not compatible with Function , which defined by Person : { name: Function }');
		     }
        });

        it('nest content of type will shown if test type function', function() {
        	try{
        		duck.type('Name',{
        			first:String,
        			last:String
        		});
        		duck.type('Person',{
        			name: duck.Name
        		});
		        duck({name:{first:'foo'}}).is(duck.Person);
		    } catch(e) {
		        assert.equal(e.message, 'name.last: undefined is not compatible with String , which defined by Person : { name: { first: String, last: String } }');
		    }
        });
	});

	describe('array error message:',function(){
        it('array', function() {
        	try{
		        duck(1).is([]);
		     } catch(e) {
		         assert.equal(e.message, '1 is not compatible with [] , which defined by inline validator : []');
		     }
        });

        it('array which define type', function() {
        	try{
		        duck(1).is([Number]);
		     } catch(e) {
		         assert.equal(e.message, '1 is not compatible with [Number] , which defined by inline validator : [Number]');
		     }
        });

        it('element which define type', function() {
        	try{
		        duck([2,3,7.8,'hello',1]).is([Number]);
		     } catch(e) {
		         assert.equal(e.message, '[3]: "hello" is not compatible with Number , which defined by inline validator : [Number]');
		     }
        });

        it('element which define type', function() {
        	try{
		        duck([2,'hello','1970-10-10']).is([Number,String,Date]);
		     } catch(e) {
		         assert.equal(e.message, '[2]: "1970-10-10" is not compatible with Date , which defined by inline validator : [Number,String,Date]');
		     }
        });
	});

	describe('array error message:',function(){
        it('complicate', function() {
        	duck.type('Level', function(value) {
        		return duck(value).is(Number) && value % 1 === 0 && value >= 0;
        	});
        	duck.type('Skill', {
        		name: String,
        		level: duck.Level
        	});
        	duck.type('Person', {
        		code: String,
        		name: {
        			first: String,
        			last: String
        		},
        		birthday: Date,
        		skills:[duck.Skill]
        	})

        	var p1 = {
        		code: '10001',
        		name: {
        			first: 'foo',
        			last: 'bar'
        		},
        		birthday: new Date(),
        		skills: [{
        			name : 'Java',
        			level: 2	
        		},{
        			name : 'JavaScript',
        			level: 1	
        		},{
        			name : 'C++',
        			level: 1	
        		}]
        	};
        	
        	assert(duck(p1).is(duck.Person));

        	var p2 = {
        		code: 10001,
        		name: {
        			first: 'foo',
        			last: 'bar'
        		},
        		birthday: new Date(),
        		skills: [{
        			name : 'Java',
        			level: 2	
        		},{
        			name : 'JavaScript',
        			level: 1	
        		},{
        			name : 'C++',
        			level: 1	
        		}]
        	};
			try{
		        duck(p2).is(duck.Person);
		    } catch(e) {
		        assert(/^code: 10001 is not compatible with String , which defined by Person :/.test(e.message));
		    }
        	var p3 = {
        		code: '10001',
        		name: {
        			first: 'foo'
        		},
        		birthday: new Date(),
        		skills: [{
        			name : 'Java',
        			level: 2	
        		},{
        			name : 'JavaScript',
        			level: 1	
        		},{
        			name : 'C++',
        			level: 1	
        		}]
        	};

        	try{
		        duck(p3).is(duck.Person);
		    } catch(e) {
		        assert(/^name.last: undefined is not compatible with String , which defined by Person :/.test(e.message));
		    }

        	var p4 = {
        		code: '10001',
        		name: {
        			first: 'foo',
        			last: 'bar'
        		},
        		birthday: new Date(),
        		skills: [{
        			name : 'Java',
        			level: 2	
        		},{
        			name : 'JavaScript',
        			level: 1	
        		},{
        			name : 'C++',
        			level: '1'	
        		}]
        	};
        	try{
		        duck(p4).is(duck.Person);
		    } catch(e) {
		    	console.log(e.message);
		        assert(/^skills\[2\].level: "1" is not compatible with validator function , which defined by Person :/.test(e.message));
		    }
        	
        });		
	});
});