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

        it('boolean', function () {
            assert.equal(duck(true).is('boolean'), true);
            assert.equal(duck(123).is('boolean'), false);
            assert.equal(duck(0).is('boolean'), false);
        });

        it('object', function () {
            assert.equal(duck({}).is('object'), true);
            assert.equal(duck([]).is('object'), true);
            assert.equal(duck(null).is('object'), true);

            assert.equal(duck(123).is('object'), false);
            assert.equal(duck('sdfsdf').is('object'), false);
            assert.equal(duck(true).is('object'), false);
            assert.equal(duck(undefined).is('object'), false);
        });

        it('undefined', function () {
            assert.equal(duck(undefined).is('undefined'), true);
            assert.equal(duck(123).is('undefined'), false);
            assert.equal(duck(0).is('undefined'), false);
        });

        it('function', function () {
            assert.equal(duck(function(){}).is('function'), true);
            assert.equal(duck(function(){}).is('object'), false);
            assert.equal(duck(123).is('function'), false);
            assert.equal(duck(0).is('function'), false);
        });
  	});

    describe('build-in object', function () {
        it('String', function () {
            assert.equal(duck('test').is(String), true);
            assert.equal(duck(123).is(String), false);
        });

        it('Number', function () {
            assert.equal(duck(123).is(Number), true);
            assert.equal(duck('test').is(Number), false);
        });

        it('Boolean', function () {
            assert.equal(duck(true).is(Boolean), true);
            assert.equal(duck(123).is(Boolean), false);
            assert.equal(duck(0).is(Boolean), false);
        });

        it('Boolean', function () {
            assert.equal(duck(true).is(Boolean), true);
            assert.equal(duck(123).is(Boolean), false);
            assert.equal(duck(0).is(Boolean), false);
        });

        it('Object', function () {
            assert.equal(duck({}).is(Object), true);
            
            assert.equal(duck([]).is(Object), false);
            assert.equal(duck('sdfsdf').is(Object), false);
            assert.equal(duck(null).is(Object), false);
            assert.equal(duck(123).is(Object), false);
            assert.equal(duck(true).is(Object), false);
            assert.equal(duck(undefined).is(Object), false);
        });

        it('Function', function () {
            assert.equal(duck(function(){}).is(Function), true);
            assert.equal(duck(function(){}).is(Object), false);
            assert.equal(duck(123).is('function'), false);
            assert.equal(duck(0).is('function'), false);
        });

        it('Date', function () {
            assert.equal(duck(new Date()).is(Date), true);
        });

        it('Array', function () {
            assert.equal(duck([]).is(Array), true);
            assert.equal(duck({}).is(Object), true);
        });

        it('RegExp', function () {
            assert.equal(duck(/(?:)/).is(RegExp), true);
        });
    });

    describe('Customize object', function () {
        it('base', function () {
            function Person() {}
            var p = new Person();
            assert.equal(duck(p).is(Person), true);
            assert.equal(duck(p).is('object'), true);
            //assert.equal(duck(p).is(Object), true);
        });

        /**
        * have not implemented yet.
        */
        xit('inherited', function () {
            function Person() {}
            function Student() {}
            Student.prototype = new Person();
            var s = new Student();
            assert.equal(duck(s).is(Student), true);
            assert.equal(duck(s).is(Person), true);
            assert.equal(duck(s).is('object'), true);
            assert.equal(duck(s).is(Object), true);
        });
    });

    describe('test many object', function () {
        it('test many object as arguments', function() {
            assert.equal(duck(1,'hello',true).are(Number,String,Boolean), true);
            assert.equal(duck(1,'hello',true).are(Number,String), false);

            assert.equal(duck(1,'hello',true).is(Number), true);
            assert.equal(duck(1).are(Number), true);
        });
    });

    describe('verify by callback function', function () {
        it('callback function', function() {
            assert.equal(duck(1).is(function(){
                return this.value === 1;
            }), true);

             assert.equal(duck(1).is(function(){
                return this.value !== 1;
            }), false);
            
        });
    });

    describe('inline object define', function () {
        it('{}', function() {
            assert.equal(duck({}).is({}), true);
            assert.equal(duck({name:'test'}).is({}), true);
            assert.equal(duck('hello').is({}), false);        
        });
        
        it('{name:String}', function() {
            assert.equal(duck({name:'hello'}).is({name:String}), true);       
        });
    });
});
