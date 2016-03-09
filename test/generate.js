describe('generate', function() {
    var schema = duckType.create();
    var duck = schema.assert;
	it('happy path for build in', function() {
		assert(duck(schema.generate(String)).is(String));
		assert(duck(schema.generate(Number)).is(Number));
		assert(duck(schema.generate(Object)).is(Object));
		assert(duck(schema.generate(Boolean)).is(Boolean));
		assert(duck(schema.generate(Date)).is(Date));
		assert(duck(schema.generate(RegExp)).is(RegExp));
		assert(duck(schema.generate(Array)).is(Array));
	});

	it('support []', function() {
		assert(duck(schema.generate([])).is([]));
		assert(duck(schema.generate([Number,String])).is([Number,String]));
		assert(duck(schema.generate([Number])).is([Number]));
	});

	it('support {}', function() {
		schema.type('Person',{
			name: {first:String, last:String},
			age: Number,
			skill: [String]
		});
		assert(duck(schema.generate(schema.Person)).is(schema.Person));
	});

	it('support constructor', function() {
		function Person() {}
		assert(duck(schema.generate(Person)).is(Person));
	});

	it('support asPrototype',function() {
		schema.type('Foo',schema.asPrototype({
			name: 'hello',
			age: 123
		}));
		duck(schema.generate(schema.Foo)).is(schema.Foo);
	});

	it('support undefined and null', function() {
		assert(duck(schema.generate(schema.UNDEFINED)).is(schema.UNDEFINED));
		assert(duck(schema.generate(schema.NULL)).is(schema.NULL));
	})

	it('support valiation function', function() {
		schema.type('Test',schema.optional(String));
		assert(duck(schema.generate(schema.Test)).is(schema.Test));
	});

	it('support and, or',function() {
		schema.type('OrTest', schema.or(String,Number,Date));
		assert(duck(schema.generate(schema.OrTest)).is(schema.OrTest));
		schema.type('AndTest', schema.and({name:String},{age:Number}));
		assert(duck(schema.generate(schema.AndTest)).is(schema.AndTest));
	});
});