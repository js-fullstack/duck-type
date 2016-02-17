var assert = require('assert');
var duck = require('../duck-type').instance();
var ma = require('./moduleA');


duck.type('ID',function(value) {
	return duck(value).is(ma.Integer) && value >= 0;
})

duck.type('Person',{
	id: duck.ID,
	name: String,
	age: ma.Integer
})

describe('duck-type', function() {
	it('happy path',function() {
		assert(duck(123).is(ma.Integer));
		assert.throws(function() {
			duck(1.1).is(ma.Integer);
		});
	});
});

module.exports = duck.bind({});