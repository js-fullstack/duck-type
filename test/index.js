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

    xdescribe('special support null and undefined', function () {
        it('support null', function() {
            assert.equal(duck(null).is(null), true);
        });

        it('support undefined', function() {
            assert.equal(duck(undefined).is(undefined), true);
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

    describe('test many object as arguments', function () {
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

        it('{name:String, age: Number}', function() {
            assert.equal(duck({name:'hello',age:5})
                .is({name:String, age:Number}), true);       
        });

        it('{name:String, age: Number}, age missing', function() {
            assert.equal(duck({name:'hello'})
                .is({name:String, age:Number}), false);       
        });

        it('{name:{first:String, second:String}, age: Number}', function() {
            assert.equal(duck({
                name: {
                    first: 'shen',
                    last: 'yu'
                },
                age :1
            }).is({
                name:{
                    first:String, 
                    last:String
                }, 
                age: Number}), true);

            assert.equal(duck({
                name: {
                    first: 'shen',
                    last: '1'
                },
                age :1
            }).is({
                name:{
                    first:String, 
                    last:Number
                }, 
                age: Number}), false);
        });

        it('{name:{first:String, second:String}, age: Number, action{callback:Function}}', function() {
            assert.equal(duck({
                name: {
                    first: 'shen',
                    last: 'yu'
                },
                age :1,
                action: {
                    callback: function(r) {}
                }
            }).is({
                name:{
                    first:String, 
                    last:String
                }, 
                age: function() {return this.value === 1},
                action: {
                    callback: Function
                }
            }), true);

            assert.equal(duck({
                name: {
                    first: 'shen',
                    last: 'yu'
                },
                age :1,
                action: {
                    callback: function(r) {}
                }
            }).is({
                name:{
                    first:String, 
                    last:String
                }, 
                age: function() {return this.value !== 1},
                action: {
                    callback: Function
                }
            }), false);
        });

        it('multi arguments combine inline object', function() {
            assert.equal(duck('peter',{
                config:{
                    host: '192.168.0.1',
                    port: 1234
                },
                doGet: function(){},
                doPost: function(){}
            },function(r){
                console.log(r);
            }).are(
                String,
                {
                    config :{
                        host: String,
                        port: Number
                    },
                    doGet: Function,
                    doPost:Function
                },
                Function
            ),true);
        });

        it('multi arguments combine inline object 2', function() {
            assert.equal(duck('peter',{
                config:{
                    host: '192.168.0.1',
                    port: 1234
                },
                doGet: function(){},
                doPost: function(){}
            },function(r){
                console.log(r);
            }).are(
                String,
                Object,
                Function
            ),true);
        });
    });

    describe('inline array define', function () {
        it('happy path',function() {
            assert.equal(duck([]).is([]), true);
            assert.equal(duck({}).is([]), false);
            assert.equal(duck([]).is({}), false);
        });

        it('[Number],[String]',function() {
            assert.equal(duck([1,2,3]).is([Number]), true);
            assert.equal(duck(['test','hello']).is([String]), true);
            assert.equal(duck([]).is([String]), true);
            assert.equal(duck([1,'ok',undefined]).is([Number,String,'undefined']), true);

            assert.equal(duck([1,null,3]).is([Number]), false);
            assert.equal(duck(['ok',undefined,3]).is([String]), false);
        });
    });

    describe('type define', function () {
        it('happy path: Short', function() {
            //define type Short
            duck.type('Short',function() {
                return duck(this.value).is(Number) && 
                    this.value % 1 === 0 &&
                    this.value <= 65536 &&
                    this.value > -65535
            });

            assert.equal(duck(1232).is('Short'), true);
            assert.equal(duck(1232).is(duck.type.Short), true);

            assert.equal(duck(65537).is('Short'), false);
            assert.equal(duck('').is('Short'), false);
            assert.equal(duck(true).is('Short'), false);
        });

        it('define Customize type, and use it as properity of Object', function() {
            //define type Short
            duck.type('Short',function() {
                return duck(this.value).is(Number) && 
                    this.value % 1 === 0 &&
                    this.value <= 65536 &&
                    this.value > -65535
            });

            duck.type('Person',{
                name: String,
                salary: 'Short'
            });

            var p1 = {
                name: 'peter',
                salary: 1234
            };

            var p2 = {
                name: 'huang',
                salary:1234567
            }

            assert.equal(duck(p1).is('Person'), true);
            assert.equal(duck(p2).is('Person'), false);
        });
    });
});
