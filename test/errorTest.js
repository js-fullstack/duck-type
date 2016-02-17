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
});