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

        it('validation function will shown if inline validation function', function() {
        	try{
		        duck(1).is(function() { return false;});
		    } catch(e) {
		        assert.equal(e.message, '1 is not compatible with inline validation function () { return false;}');
		    }
        });

        it('name of type will shown if test type function', function() {
        	try{
        		duck.type('MyType', function() {
        			return false;
        		});
		        duck(1).is(duck.MyType);
		    } catch(e) {
		        assert.equal(e.message, '1 is not compatible with MyType');
		    }
        });

        it('object definiation will shown in error message if inline {}', function() {
        	try{
		        duck({xx:'hello'}).is({name: String});
		    } catch(e) {
		        assert.equal(e.message, '{ xx: \'hello\' } is not compatible with { name: String }');
		    }
        });

        it('nest object definiation will shown in error message if inline {}', function() {
        	try{
		        duck({xx:'hello'}).is({name:{
		        	first: String,
		        	last:String
		        }});
		    } catch(e) {
		        assert.equal(e.message, '{ xx: \'hello\' } is not compatible with { name: { first: String, last: String } }');
		    }
        });

       it('content of type will shown if test type function', function() {
        	try{
        		duck.type('Person',{
        			name: String
        		});
		        duck({xx:'hello'}).is(duck.Person);
		    } catch(e) {
		        assert.equal(e.message, '{ xx: \'hello\' } is not compatible with { name: String }');
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
		        duck({xx:'hello'}).is(duck.Person);
		    } catch(e) {
		        assert.equal(e.message, '{ xx: \'hello\' } is not compatible with { name: { first: String, last: String } }');
		    }
        });

	});
});