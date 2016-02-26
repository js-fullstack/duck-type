describe('generate', function() {
	var duck = duckType.create();
	it('happy path for build in', function() {
		assert(duck(duck.generate(String)).is(String));
		assert(duck(duck.generate(Number)).is(Number));
		assert(duck(duck.generate(Object)).is(Object));
		assert(duck(duck.generate(Boolean)).is(Boolean));
		assert(duck(duck.generate(Date)).is(Date));
		assert(duck(duck.generate(RegExp)).is(RegExp));
		assert(duck(duck.generate(Array)).is(Array));
	});

	it('support []', function() {
		assert(duck(duck.generate([])).is([]));
		assert(duck(duck.generate([Number,String])).is([Number,String]));
		assert(duck(duck.generate([Number])).is([Number]));
	});

	it('support {}', function() {
		duck.type('Person',{
			name: {first:String, last:String},
			age: Number,
			skill: [String]
		});
		assert(duck(duck.generate(duck.Person)).is(duck.Person));
	});

	it('support constructor', function() {
		function Person() {}
		assert(duck(duck.generate(Person)).is(Person));
	});

	it('support asPrototype',function() {
		duck.type('Foo',duck.asPrototype({
			name: 'hello',
			age: 123
		}));
		duck(duck.generate(duck.Foo)).is(duck.Foo);
	});

	it('support undefined and null', function() {
		assert(duck(duck.generate(duck.UNDEFINED)).is(duck.UNDEFINED));
		assert(duck(duck.generate(duck.NULL)).is(duck.NULL));
	})

	it('support valiation function', function() {
		duck.type('Test',duck.optional(String));
		assert(duck(duck.generate(duck.Test)).is(duck.Test));
	});

	it('support and, or',function() {
		duck.type('OrTest', duck.or(String,Number,Date));
		assert(duck(duck.generate(duck.OrTest)).is(duck.OrTest));
		duck.type('AndTest', duck.and({name:String},{age:Number}));
		assert(duck(duck.generate(duck.AndTest)).is(duck.AndTest));
	});
});