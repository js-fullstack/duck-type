# duck-type

Duck type is a JavaScript library, which provide a **natural way** to define and validate your data structure in JavaScript. The purpose of this library is try to help you to build up 'Complicated But Robust JavaScript Program', especially when you have to teamwork with other peoples, or developing your code based on unstable API.

## Getting Started 

Currently, duck-type can only support version on NodeJS:
```Bash
   npm install duck-type
```
and, use it in your code, like:
```javascript
  var duck = require('../duck-type').instance();
```
### Validation: 

Let us get start with validation:

#### Example 1
Suppose we have to implement a function:
```JavaScript
  function foo(param1) {
    ...
  }
``` 
and we want to make sure that 'param1' should be a String, we can verify the type of 'param1' like this:
```JavaScript
  function foo(param1) {
    duck(param1).is(String);
    ...
  }
```
We also can verify many parameters at once, like:
```JavaScript
    duck(param1, param2).are(String, Number);	
```

#### Example 2

How about complex object like:
```JavaScript
  {
    name:'hello', 
    age: 12345
  };
```
We can verify it like:
```
  duck(param1).is({
    name:String, 
    age:Number
  });
```
Note, the following object can also be passed, which means, relative to definition, the properties can be 'more', but can not be 'less':
```JavaScript
  duck({             //also can be passed, means the object is compatible with  the type
    name:'hello', 
    age: 12345, 
    something:'foo'}
  ).is({
    name:String, 
    age:Number
  }); 
```
#### Example 3

We can verify the more complicated object like this:
```JavaScript
  duck(param1).is({
    name : {
      first:String, 
      last:String
    },
    age: Number,
    sayHello: Function
    });
```	
Here :

  'sayHello': Function means target object which to verified must have a method named 'sayHello'.
  
  'name', is a nest object.

#### Example 4

For array, duck-type can support different pattern:
```JavaScript
  duck(x).is([]); //means x must be a array, it eaual to is(Array)
	
  duck(X).is([Number]); //means x must be a array, and each element of the array must be a Number
	
  duck(X).is([Number,String,Date]); 
  //means x must be a array, and the first element  must be a Number, the second element must be a String....
```
Of cause, we can combine definition of array and object, like;
```JavaScript
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

### Define our data structure, so-called duck type:

Don't stop with verify. Declare the data structure and re-use them might be a better choice.

#### Example 5

How to define type? Just do it like:
```JavaScript
  duck.type('ResourceDemand',{	//now, we defined a type ResourceDemand
    resourceTypeId: Number,
    year: Number,
    month: Number,
    quantity: Number
  });
```

And how to use it? It is easy.
```JavaScript
	duck(param1).is(duck.ResourceDemand);
```
#### Example 6

We can define some basic type, even like java.lang.Integer
```JavaScript
	duck.type('Integer',function(value){
		return duck(value).is(Number) && value % 1 === 0 && value >= -2147483648 && value <= 2147483647;
	});
```
Here, by define the validate function we can decided what is 'Integer' in our program.

#### Example 7

We can defined new type by leverage data structure which have already defined, I mean:
```JavaScript
  duck.type('Proposal',{
    id: duck.Integer
    title: String,
    description: String,
    resourceDemands: [duck.ResourceDemand]
});	
```

### Other interesting features:

#### Example 8

##### Mock data. 

Type define first is encouraged, it is practice of 'Convention First'. And if your have defined a type already. 'mock' is another benefit provided by duck-type.

```JavaScript
  duck.mock(duck.Proposal);  //it will return an object, which must compatible with type Proposal.
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

#### Example 9

##### Optional property

The type can define optional property for an object by using function duck.optional.

```JavaScript
  duck.type('Profile', {
    name: String,
    skill: duck.optional([String])
  });
```
Here, 'name' is mandatory property and the value of it must be a String, 'skill' is a **optional property**, it can be undefined, BUT, if it has value, the value must be a array and which elements must be a String.

#### Example 10

##### Operator: And, Or

Dynamic data type of arguments is common in JavaScript. which means we need operator 'Or',

```JavaScript
  Duck.type('Config',{   //here is definition of type 'Config'
    id: Number,
    layout: [String]
  });
  Duck(x).is(duck.or(String, duck.Config));
```
Here, the value of parameter 'x' can be a String, or can be a complex config object.

#### Example 11

##### Implement Interfaces

In Java world, we often need make sure a Object must implement Interface A, Interface B... Similarly, operator 'And' can used for this purpose in JavaScript.

```JavaScript
  Duck.type('Config',{ //here is definition of type 'Config'
    orderBy:[String]
    layout: [String]
  });

 Duck.type('Query',{ //here is definition of type 'Query'
    table: String,
    id: Number
  });

 Duck(x).is(duck.and(duck.Config, duck.Query)); 
```
Here, we want to make sure the value of 'x' must implement type 'Config', and type 'Query', that means in duck typing world, x can used as a 'Config' object, and also can be used as 'Query' object at same time. 
###End

The library duck-type is still developing continually, more interesting feature will be bring to you. We also except any of your comments. 

----------------
More information can be get by accessing [Wiki page](https://github.com/js-fullstack/duck-type/wiki)

Thanks :) 
