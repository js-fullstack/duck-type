var assert = require('assert');
var duck = require('../duck-type').namespace();


describe('mock', function() {
	it('happy path for build in', function() {
		assert(duck(duck.mock(String)).is(String));
		assert(duck(duck.mock(Number)).is(Number));
		assert(duck(duck.mock(Object)).is(Object));
		assert(duck(duck.mock(Boolean)).is(Boolean));
		assert(duck(duck.mock(Date)).is(Date));
		assert(duck(duck.mock(RegExp)).is(RegExp));
		assert(duck(duck.mock(Array)).is(Array));
	});

	it('support []', function() {
		assert(duck(duck.mock([])).is([]));
		assert(duck(duck.mock([Number,String])).is([Number,String]));
		assert(duck(duck.mock([Number])).is([Number]));
	});

	it('support {}', function() {
		duck.type('Person',{
			name: {first:String, last:String},
			age: Number,
			skill: [String]
		});
		assert(duck(duck.mock(duck.Person)).is(duck.Person));
	});

	it('support constructor', function() {
		function Person() {}
		assert(duck(duck.mock(Person)).is(Person));
	});

	it('support asPrototype',function() {
		duck.type('Foo',duck.asPrototype({
			name: 'hello',
			age: 123
		}));
		duck(duck.mock(duck.Foo)).is(duck.Foo);
	});

	it('support undefined and null', function() {
		assert(duck(duck.mock(duck.UNDEFINED)).is(duck.UNDEFINED));
		assert(duck(duck.mock(duck.NULL)).is(duck.NULL));
	})

	it('support valiation function', function() {
		duck.type('Test',duck.optional(String));
		assert(duck(duck.mock(duck.Test)).is(duck.Test));
	});

	it('support and, or',function() {
		duck.type('OrTest', duck.or(String,Number,Date));
		assert(duck(duck.mock(duck.OrTest)).is(duck.OrTest));
		duck.type('AndTest', duck.and({name:String},{age:Number}));
		assert(duck(duck.mock(duck.AndTest)).is(duck.AndTest));
	});
});