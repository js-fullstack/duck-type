var assert = require('assert');
var duck = require('../duck');
describe('duck-type', function() {
  	describe('base function', function () {
	    it('should a function as node module', function () {
	      	assert.equal(typeof duck,'function');
	    });
	});

	describe('build-in type', function () {
    	it('string', function () {
    		assert.equal(duck('test').is('string'), true);
    		assert.equal(duck(123).is('string'), false);
    	});

    	it('number', function () {
    		assert.equal(duck(123).is('number'), true);
    		assert.equal(duck('test').is('number'), false);
    	});
  	}); 
});
