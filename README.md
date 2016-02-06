duck-type
==================
duck type is a JS library, which can be used to verify parameter, define reuseable data structre, mock data... The purpose of duck-type is try to help you to build up 'Complicated But Robust JS Program', especially when you have to teamwork with others, or developing your code based on unstable API.

introduce in 5 minutes. 

Prepare in version on nodejs:
```javascript
	var duck = require('../duck-type').namespace();
```
Part One, validtion: 
---------------------

let us get start with examples:

### example 1
support we have to implement a function foo(param1) {...}, and we want to make sure that param1 should be a String

you can verify the type of param1 like this:
```javascript
	function foo(param1) {
		duck(param1).is(String);
		...
	}
```
you also can verify many parameters at once, like:
```javascript
	duck(param1, param2).are(String, Number);	
```

### example 2

how about complex object like:
```javascript
  {
    name:'hello', 
    age: 12345
  };
```
you can verify it like:
```
	duck(param1).is({
	  name:String, 
	  age:Number
	});
```
note, the following object can also be passed, which means, relative to validator defination, the property can be more, but can not be less:
```javascript
	duck({             //also can be passed, means the object is compatible with  the type
	  name:'hello', 
	  age: 12345, 
	  something:'foo'}
	 ).is({name:String, age:Number}); 
```
### example 3

you can verify the more complicated object like this:
```javascript
	duck(param1).is({
		name : {
		  first:String, 
		  last:String
		},
		age: Number,
		sayHello: Function
	});
```	
here :
  'sayHello': Function means target object which to verified must have a method which named 'sayHello'.
  
  'name', is a nest object.

### example 4

For array, duck-type can support different and interseting pattern:
```javascript
	duck(x).is([]); //means x must be a array, it eaual to is(Array)
	
	duck(X).is([Number]); //means x must be a array, and each element of the array must be a Number
	
	duck(X).is([Number,String,Date]); 
	//means x must be a array, and the first element  must be a Number, the second element must be a String....
```
Of cause, you can combine defination of array and defination of object, like;
```javascript
  duck(param1).is({
    title: String,
    description: String,
      resourceDemands: [{
		  resourceTypeId: Number,
		  year: Number,
		  month: Number,
		  quantity: Number
		  }]
  })
```
Part Two, define data structure, so-called duck type:
-----------------------
Don't stop with verify. Declare the data structure and re-use them might be a better choice.

### example 5

How to define type? Just do it like:
```javascript
  duck.type('ResourceDemand',{	//now, we defined a type ResourceDemand
		resourceTypeId: Number,
		year: Number,
		month: Number,
		quantity: Number
	});
```

And how to use it? It is easy.
```javascript
	duck(param1).is(duck.ResourceDemand);
```
### example 6

You can define some basic type, even like java.lang.Integer
```javascript
	duck.type('Integer',function(value){
		return duck(value).is(Number) && value % 1 === 0 && value >= -2147483648 && value <= 2147483647;
	});
```
You also can define bussiness type like:
```javascript
	duck.type('Email', function(value) {
		...
	});
	
	duck.type('IpAddress', function(value) {
		...
	})
```	
Here, the callback function will be as a validator when test target, and the target will be pass to callback by parameter 'value'.

### example 7

You can leverage type which alreay definedto defined your new type, I mean:
```javascript
	duck.type('Proposal',{
		id: duck.Integer
		title: String,
		description: String,
		resourceDemands: [duck.ResourceDemand]
	});	
```

Part Three, mock data:
-------------------------
Type define first is encouraged, it is practice of 'Convention First'. And if your have defined a type already. 'mock' is another benefit provoided by duck-type.

### example 8
```javascript
	duck.mock(duck.Proposal); //it will return an object, which must compatible with type Proposal.
```
I mean, 
```javascript	
	{
	  id: 112,
		title: 'sdfasf adsf',
		description: 'sdfsdf sdf 234s sd',
		resourceDemands: [{
			resourceTypeId: 123,
			year: 2343,
			month: 234,
			quantity: 444
		}]
	}
```
The object like above might be return, of cause, most of value will be changed randomly.

Type define first. then start your work with mock data, then verify parameter at product  runtime.

End
--------------------------
The library duck-type is still developing continully, and we except any of your comments. Thanks :) 

