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
            assert(duck('test').is('string'));
            assert.throws(function(){
                duck(123).is('string');
            });
        });

        it('number', function () {
            assert(duck(123).is('number'));
            assert.throws(function() {
                duck('test').is('number');
            });
        });

        it('boolean', function () {
            assert(duck(true).is('boolean'));

            assert.throws(function(){
                duck(123).is('boolean');
            });

            assert.throws(function(){
                duck(0).is('boolean');
            });
        });

        it('object', function () {
            assert(duck({}).is('object'));
            assert(duck([]).is('object'));
            assert(duck(null).is('object'));
            assert(duck(123).is('object'));
            assert(duck('sdfsdf').is('object'));
            assert(duck(true).is('object'));

            assert.throws(function() {
                duck(undefined).is('object');
            });
        });

        it('undefined', function () {
            assert(duck(undefined).is('undefined'));
            assert.throws(function(){
                duck(123).is('undefined');
            });
            assert.throws(function(){
                duck(0).is('undefined');
            });
        });

        it('function', function () {
            assert(duck(function(){}).is('function'));
            assert(duck(function(){}).is('object'));
            assert(duck(function(){}).is(Object));
            assert.throws(function(){
                duck(123).is('function');
            });
            assert.throws(function(){
                duck(0).is('function');
            });
        });
    });

    describe('special support null and undefined, and self test', function () {
        it('support null', function() {
            assert(duck(null).is(Object));
            assert(duck(null).is('object'));
            assert.throws(function(){
                duck(null).is({});
            });
        });

        it('support undefined', function() {
            assert(duck(undefined).is('undefined'));
            assert.throws(function(){
                duck(undefined).is(undefined);
            });
            assert.throws(function(){
                duck(undefined).is({});
            });
            assert.throws(function(){
                duck(undefined).is(object);
            });
            assert.throws(function(){
                duck(undefined).is(Object);
            });
        });

        it('support self test', function() {
            assert.throws(function(){
                duck(5).is(5);
            });
        });
    });

    describe('build-in object', function () {
        it('String', function () {
            assert(duck('test').is(String));
            assert.throws(function(){
                duck(123).is(String);
            });
        });

        it('Number', function () {
            assert(duck(123).is(Number));
            assert.throws(function() {
                duck('test').is(Number);
            });
        });

        it('Boolean', function () {
            assert(duck(true).is(Boolean));
            assert.throws(function(){
                duck(123).is(Boolean);
            });
            assert.throws(function(){
                duck(0).is(Boolean);
            });
        });

        it('Object', function () { 
            assert(duck({}).is(Object));
            
            assert(duck([]).is(Object));
            assert(duck('sdfsdf').is(Object));
            
            duck(123).is(Object);

            duck(true).is(Object);


            duck(function(){}).is(Object);
        });

        it('Function', function () {
            assert(duck(function(){}).is(Function));
            assert(duck(function(){}).is(Object));
            
            assert.throws(function(){
                duck(123).is('function');
            });
            assert.throws(function(){
                duck(0).is('function');
            });
        });

        it('Date', function () {
            assert(duck(new Date()).is(Date));
        });

        it('Array', function () {
            assert(duck([]).is(Array));
        });

        it('RegExp', function () {
            assert(duck(/(?:)/).is(RegExp));
        });
    });

    describe('Constructor and Prototype', function () {
        it('base', function () {
            function Person() {}
            var p = new Person();
            assert(duck(p).is(Person));
            assert(duck(p).is('object'));
            assert(duck(p).is(Object));
        });

        /**
        * have not implemented yet.
        */
        it('inherited by prototype chain', function () {
            function Person() {}
            function Student() {}
            Student.prototype = new Person();
            var s = new Student();
            assert(duck(s).is(Student));
            assert(duck(s).is(Person));
            assert(duck(s).is('object'));
            assert(duck(s).is(Object));
            assert.throws(function(){
                duck(new Person()).is(Student);
            });
        });

        it('inherited by Object.create', function() {
            var Foo = {
                name: 'test'
            };

            var foo = Object.create(Foo);
            assert(duck(foo).is(Foo));

            var bar = Object.create(foo);
            assert(duck(bar).is(Foo));
        })
    });

    describe('test "are":  many object as arguments', function () {
        it('test many object as arguments', function() {
            assert(duck(1,'hello',true).are(Number,String,Boolean));
            
            assert.throws(function(){
                duck(1,'hello',true).are(Number,String);
            });

            assert.throws(function(){
                duck(1,'hello',true).are('string',String,Boolean);
            });

            assert(duck(1,'hello',true).is(Number));
            assert(duck(1).are(Number));
        });
    });

    describe('verify by callback function', function () {
        it('callback function', function() {
            assert(duck(1).is(function(){
                return this.valueOf() === 1;
            }));

            assert.throws(function(){
                duck(1).is(function(){
                    return this.valueOf() !== 1;
                });
            });
            
        });
    });

    describe('inline object define', function () {
        it('{}', function() {
            assert(duck({}).is({}));
            assert(duck({name:'test'}).is({}));
            assert(duck('hello').is({}));     
            assert(duck(123).is({}));  
        });

        it('{name:String}', function() {
            assert(duck({name:'hello'}).is({name:String}));       
        });

        it('{name:String, age: Number}', function() {
            assert(duck({name:'hello',age:5})
                .is({name:String, age:Number}));       
        });

        it('{name:String, age: Number}, age missing', function() {
            assert.throws(function(){
                duck({name:'hello'})
                    .is({name:String, age:Number});
                });       
        });

        it('{name:{first:String, second:String}, age: Number}', function() {
            assert(duck({
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
                age: Number}));

            assert.throws(function() {
                duck({
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
                    age: Number})
                });
        });

        it('{name:{first:String, second:String}, age: Number, action{callback:Function}}', function() {
            assert(duck({
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
                age: function() {return this.valueOf() === 1},
                action: {
                    callback: Function
                }
            }));

            assert.throws(function(){
                duck({
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
                    age: function() {return this.valueOf() !== 1},
                    action: {
                        callback: Function
                    }
                });
            });
        });

        it('multi arguments combine inline object', function() {
            assert(duck('peter',{
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
            ));
        });

        it('multi arguments combine inline object 2', function() {
            assert(duck('peter',{
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
            ));
        });
    });

    describe('inline array define', function () {
        it('happy path', function(){
            assert(duck([]).is([]));
            assert.throws(function(){
                duck({}).is([]);
            });
            assert(duck([]).is({}));
        });

        it('[Number],[String]',function() {
            assert(duck([1,2,3]).is([Number]));
            assert(duck(['test','hello']).is([String]));
            assert(duck([]).is([String]));
            assert(duck([1,'ok',undefined]).is([Number,String,'undefined']));

            assert.throws(function(){
                duck([1,null,3]).is([Number]);
            });
            assert.throws(function(){
                duck(['ok',undefined,3]).is([String]);
            });
        });
    });

    describe('inline define, combine [], {}, function(){}',function() {
        it('combine [{}]', function() {
            assert(duck([1,{name:'test'}]).is([Number,{name:String}]));
        });

        it('combine [{[]}]', function() {
            assert(duck([1,{name:'test',list:[1,2,3]}]).is([Number,{name:String, list:[Number]}]));
        });

        it('combine {[{}]}', function() {
            assert(duck({name:'foo',list:[{x:10,y:20},{x:1,y:2}]}).is({name:String, list:[{x:Number, y:Number}]}));
        });

        it('combine {function(){}}', function() {
            assert(duck({name:'foo', age:2, something:'test'}).is({name:String, age:function(){ return this > 0 ;}}));
            assert.throws(function(){
                duck({name:'foo', age:2}).is({name:String, age:function(){ return this > 10 ;}});
            });
        });

        it('combine [function(){}]', function() {
            assert(duck([2,4]).is([function(){ return this % 2 === 0;}]));
            assert.throws(function(){
                duck([1,2]).is([function(){ return this % 2 === 0;}]);
            });
        });

        it('',function() {
            duck.type('Foo', {name:String});
            var something1 = {
                name: 'bar',
                age:123,
                resource: {
                    owner: {
                        name: 'test'
                    }
                }
            };
            var something2 = {
                age:123
            };
            duck(something1).is('Foo');

            duck(something1).is({resource: {owner:{name:Object}}});
            assert.throws(function() {
                duck(something2).is('Foo');
            })
        });
    });

    describe('type define', function () {
        it('happy path: Short', function() {
            //define type Short
            duck.type('Short',function() {
                return duck(this).is(Number) && 
                    this % 1 === 0 &&
                    this <= 65536 &&
                    this > -65535
            });

            assert(duck(1232).is('Short'));
            assert(duck(1232).is(duck.type.Short));

            assert.throws(function(){
                duck(65537).is('Short');
            });
            assert.throws(function(){
                duck('').is('Short');
            });
            assert.throws(function(){
                duck(true).is('Short');
            });
        });

        it('define Customize type, and use it as properity of Object', function() {
            //define type Short
            duck.type('Short',function() {
                return duck(this).is(Number) && 
                    this % 1 === 0 &&
                    this <= 65536 &&
                    this > -65535
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

            assert(duck(p1).is('Person'));
            assert.throws(function(){
                duck(p2).is('Person');
            });
        });

        it('Complex type define',function() {
            duck.type('ID',function() { return duck(this).is(Number) && this > 0 && this % 1 === 0; });
            duck.type('Year',function() { return duck(this).is(Number) && this < 9999 && this >= 0; });
            duck.type('Month',function() { return duck(this).is(Number) && this < 12 && this >= 0; });
            duck.type('ResourceDemand',{
                year: 'Year',
                month: 'Month',
                quantity: Number
            });
            duck.type('Proposal',{
                id: 'ID',
                startDate: Date,
                endDate: Date,
                description: String,
                resourceDemands:['ResourceDemand']
            });

            var p1 = {
                id: 12345,
                startDate: new Date(),
                endDate: new Date(),
                description: 'Please use duck-type to build your js system',
                resourceDemands:[{
                    year: 2016,
                    month:2,
                    quantity:10
                },{
                    year: 2016,
                    month:3,
                    quantity:1
                }]
            };

            assert(duck(p1).is('Proposal'));

        });

        it('alias of Number', function() {
            duck.type('MyNumber',Number);

            assert(duck(123).is('MyNumber'));
            assert.throws(function() {
                duck(true).is('MyNumber');
            });
        });
    });

    xdescribe('or, and', function() {

    });
});

describe('mute', function() {
    it('duck(xxx).is(XXX) will not throw Error when it as a validator executed in context duck.type', function() {
        var checkpoint = false;
        duck.type('Integer', function() {
            var result = duck(this).is(Number) && this % 1 === 0;
            checkpoint = true;
            return result;
        });

        assert(duck(123).is('Integer'));
        assert(checkpoint);
        assert.throws(function() {
            duck('123').is('Integer');
        });
    });

    it('mute block', function() {
        var checkpoint = false;
        duck.mute(function(){
            assert.equal(duck(2).is(String), false);
            checkpoint = true;
        });
        assert(checkpoint);
    });
    
    it('mute true/false', function() {
        var checkpoint = false;
        duck.mute(true);
        try{
            assert.equal(duck(2).is(String), false);
            checkpoint = true;
        } finally {
            duck.mute(false);
        }
        
        assert(checkpoint);
    });

    it('duck turn off', function() {
        var checkpoint = false;
        duck.turnoff();
        assert(duck(2).is(String));
    });
});

