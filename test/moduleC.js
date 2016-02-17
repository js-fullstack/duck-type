var assert = require('assert');
var duck = require('../duck-type').instance();
var mb = require('./moduleB');


describe('module in node', function() {
	it('happy path',function() {
		var p1 = {
			id: 12345,
			name: 'foo',
			age: 12
		};
		var p2 = {
			id: -1,
			name: 'foo',
			age:12
		};
		assert(duck(1).is(mb.ID));
		assert(duck(p1).is(mb.Person));
		assert.throws(function() {
			duck(p2).is(mb.Person);
		});
	});
});