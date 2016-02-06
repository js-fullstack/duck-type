var assert = require('assert');
var duck = require('../duck-type').namespace();


describe('duck-type', function() {
    describe('base function', function () {
        it('should a function as node module', function () {
            assert.equal(typeof duck,'function');
        });
    });

    describe('special support null and undefined, and self test', function () {
        it('support null', function() {
            assert(duck(null).is(Object));
            assert(duck(null).is({}));
        });

        it('support undefined', function() {
            assert(duck(undefined).is(duck.UNDEFINED));
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

        it('support duck.type.UNDEFINED', function() {
            assert(duck(undefined).is(duck.UNDEFINED));
        });

        it('support duck.type.NULL', function() {
            assert(duck(null).is(duck.NULL));         
            assert.throws(function() {
                duck(123).is(duck.NULL);
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
            assert(duck(s).is(Object));
            assert.throws(function(){
                duck(new Person()).is(Student);
            });
        });

        it('inherited by Object.create', function() {
            var Foo = {
                name: 'string'
            };

            var foo = Object.create(Foo);
            assert(duck(foo).is(duck.asPrototype(Foo)));

            var bar = Object.create(foo);
            assert(duck(bar).is(duck.asPrototype(Foo)));

            assert.throws(function() {
                duck({name:'test'}).is(duck.asPrototype(Foo));
            })
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
            assert(duck(1).is(function(value){
                return value === 1;
            }));

            assert.throws(function(){
                duck(1).is(function(value){
                    return value !== 1;
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
                age: function(value) {return value === 1},
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
                    age: function(value) {return value !== 1},
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
            assert(duck([1,'ok',undefined]).is([Number,String,duck.UNDEFINED]));

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
            assert(duck({name:'foo', age:2, something:'test'}).is({name:String, age:function(value){ return value > 0 ;}}));
            assert.throws(function(){
                duck({name:'foo', age:2}).is({name:String, age:function(value){ return value > 10 ;}});
            });
        });

        it('combine [function(){}]', function() {
            assert(duck([2,4]).is([function(value){ return value % 2 === 0;}]));
            assert.throws(function(){
                duck([1,2]).is([function(value){ return value % 2 === 0;}]);
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
            duck(something1).is(duck.Foo);

            duck(something1).is({resource: {owner:{name:Object}}});
            assert.throws(function() {
                duck(something2).is(duck.Foo);
            })


        });
    });

    describe('type define', function () {
        it('happy path: Short', function() {
            //define type Short
            duck.type('Short',function(value) {
                return duck(value).is(Number) && 
                    value % 1 === 0 &&
                    value <= 65536 &&
                    value > -65535
            });

            assert(duck(1232).is(duck.Short));
            assert(duck(1232).is(duck.Short));

            assert.throws(function(){
                duck(65537).is(duck.Short);
            });
            assert.throws(function(){
                duck('').is(duck.Short);
            });
            assert.throws(function(){
                duck(true).is(duck.Short);
            });
        });

        it('define Customize type, and use it as properity of Object', function() {
            //define type Short
            duck.type('Short',function(value) {
                return duck(value).is(Number) && 
                    value % 1 === 0 &&
                    value <= 65536 &&
                    value > -65535
            });

            duck.type('Person',{
                name: String,
                salary: duck.Short
            });

            var p1 = {
                name: 'peter',
                salary: 1234
            };

            var p2 = {
                name: 'huang',
                salary:1234567
            }

            assert(duck(p1).is(duck.Person));
            assert.throws(function(){
                duck(p2).is(duck.Person);
            });
        });

        it('Complex type define',function() {
            duck.type('ID',function(value) { return duck(value).is(Number) && value > 0 && value % 1 === 0; });
            duck.type('Year',function(value) { return duck(value).is(Number) && value < 9999 && value >= 0; });
            duck.type('Month',function(value) { return duck(value).is(Number) && value < 12 && value >= 0; });
            duck.type('ResourceDemand',{
                year: duck.Year,
                month: duck.Month,
                quantity: Number
            });
            duck.type('Proposal',{
                id: duck.ID,
                startDate: Date,
                endDate: Date,
                description: String,
                resourceDemands:[duck.ResourceDemand]
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

            assert(duck(p1).is(duck.Proposal));

        });

        it('alias of Number', function() {
            duck.type('MyNumber',Number);

            assert(duck(123).is(duck.MyNumber));
            assert.throws(function() {
                duck(true).is(duck.MyNumber);
            });
        });
    });

    describe('or, and, optional, nullable', function() {
        it('support or', function() {
            assert(duck(1).is(duck.or(Number,String)));
            assert(duck('123').is(duck.or(Number,String)));
            assert(duck(123).is(duck.or(Number,duck.UNDEFINED)));
            assert(duck().is(duck.or(Number,duck.UNDEFINED)));
            assert.throws(function(){
                duck(true).is(duck.or(Number,String));
            });
        });

        it('support and',function() {
            duck.type('Foo', {name:String});
            duck.type('Bar',{age:Number});
            duck.type('Both',duck.and(duck.Foo,duck.Bar));

            var ok = {
                name:'hello',
                age: 123
            };

            var error1 = {name:'hello'};
            var error2 = {age:123};
            assert(duck(ok).is(duck.Both));
            assert(duck(ok).is(duck.and(duck.Foo,duck.Bar)));
            assert.throws(function(){
                duck(error1).is(duck.Both);
            });
            assert.throws(function(){
                duck(error2).is(duck.Both);
            });
        });

        it('support optional', function() {
            assert(duck(undefined).is(duck.optional(Number)));
            assert(duck({name:'test'}).is({name:String, age: duck.optional(Number)}));
            assert(duck({name:'test', age:12345}).is({name:String, age: duck.optional(Number)}));
            assert.throws(function() {
                duck({name:'test', age:'12345'}).is({name:String, age: duck.optional(Number)});
            });
        });
    });
});

describe('namespace',function() {
    it('happy path', function() {
        var duck1 = require('../duck-type').namespace();
        duck1.type('HELLO',String);
        var duck2 = require('../duck-type').namespace();
        assert(duck1('hello').is(duck1.HELLO));
        assert(duck2('hello').is(duck1.HELLO));
    });

    it('import happy path', function() {
        function exportAbc() {
            var abc = require('../duck-type').namespace();
            abc.type('HELLO',function(v) {
                return duck(v).is(String);
            });
            return abc;
        }

        function exportXyz() {
            var xyz = require('../duck-type').namespace();
            var abc = exportAbc();
            xyz.type('Person',{
                name: abc.HELLO
            });
            return xyz;
        }
        var duck = require('../duck-type').namespace();
        var xyz = exportXyz();
        duck.type('Test',function(v) {
            return duck(v).is(xyz.Person);
        })

        duck({name:'hello'}).is(duck.Test);
    });

    
});

describe('partially check',function() {
    duck.type('Person',{
        name: {first:String, last:String},
        age: Number
    });

    var name = {
        first:'foo',
        last:'bar'
    };

    assert(duck(name).is(duck.Person.name));
    assert(duck(123).is(duck.Person.age));
});

describe('parameterize',function() {

    duck.type('Range', duck.parameterize(function(value, a, b){
        return duck(value).is(Number) && value >= a && value <=b; 
    },function(a, b){
        return a + Math.random() * (b - a);
    }));

    assert(duck(3).is(duck.Range(2,4)));
    assert.throws(function(){
        duck(5).is(duck.Range(2,4));
    });
    assert(duck(duck.mock(duck.Range(2,4))).is(duck.Range(2,4)));
});

describe('mute', function() {
    it('duck(xxx).is(XXX) will not throw Error when it as a validator executed in context duck.type', function() {
        var checkpoint = false;
        duck.type('Integer', function(value) {
            var result = duck(value).is(Number) && value % 1 === 0;
            checkpoint = true;
            return result;
        });

        assert(duck(123).is(duck.Integer));
        assert(checkpoint);
        assert.throws(function() {
            duck('123').is(duck.Integer);
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

    xit('duck turn off', function() {
        var checkpoint = false;
        duck.turnoff();
        assert(duck(2).is(String));
    });
});

