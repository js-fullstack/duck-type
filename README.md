# duck-type

Duck type is a schema and validator JavaScript library, which provide a **natural way** to define schema and validate your data structure in JavaScript. The purpose of this library is try to help you to build up 'Complicated But Robust JavaScript Program', especially when you have to teamwork with other peoples, or developing your code based on unstable API.

## Getting Started 

Currently, duck-type can support both NodeJS and browser:
```Bash
   ## in node
   npm install duck-type
```
Or
```Bash
   ## in browser
   bower intall duck-type
```

and, use it in your code, like:
```javascript
  // in node 
  var schema = require('../duck-type').create();
```
Or
```javascript
  // in browser, global variable  duckType
  var schema = duckType.create();
```
Or
```javascript
  // in browser, requirejs/amd  duckType
  define(['./scripts/duck-type.js'],function(duckType) {
     var schema = duckType.create();
  });
```

### Validation: 

Let us get start with validation:

#### Example 1
We wish that 'x' should be a String, we can verify the type of 'x' like this:
```JavaScript
  function foo(x) {
    schema.assert(x).is(String);
    ...
  }
```

We also can verify many parameters at once, like:

```JavaScript
    schema.assert(x, y).are(String, Number);	
```

#### Example 2

We can verify complex object by schema like:
```
  schema.assert(x).is({
    name:String, 
    age:Number
  });
```

#### Example 3

Even support **"nest"** schema like this:
```JavaScript
  schema.assert(x).is({
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
  
  'name', is a nest schema.

#### Example 4

For array, duck-type can support different pattern:
```JavaScript
  schema.assert(x).is([]); //x must be a array, element can by any type
	
  schema.assert(X).is([Number]); //x must be a array, element must be a Number
	
  schema.assert(X).is([Number, String, Date]); 
  /*
    means x must be a array, 
    and the first element  must be a Number, 
    the second element must be a String....
  */
```

Of cause, we can combine definition of array and object, like;
```JavaScript
  schema.assert(x).is({
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

### Define schema:

Save schema as **"type"** to re-use them.

#### Example 5

Define a type:
```JavaScript
  schema.type('ResourceDemand',{	//now, we defined a type ResourceDemand
    resourceTypeId: Number,
    year: Number,
    month: Number,
    quantity: Number
  });
```

Re-use type.
```JavaScript
	schema.assert(x).is(schema.ResourceDemand);
```
#### Example 6

We can define some basic type, even like java.lang.Integer
```JavaScript
	schema.type('Integer',function(value){
		return schema.assert(value).is(Number) && value % 1 === 0 && value >= -2147483648 && value <= 2147483647;
	});
```
Here, by define the validate function we can decided what is 'Integer' in our program.

#### Example 7

Defined new type by leverage existing type, I mean:
```JavaScript
  schema.type('Proposal',{
    id: schema.Integer
    title: String,
    description: String,
    resourceDemands: [schema.ResourceDemand]
});	
```

### Other interesting features:

#### Example 8

##### Generate data. 

'Generate' is another interesting feature provided by duck-type.

```JavaScript
  schema.generate(schema.Proposal);  //it will return an object, which must compatible with type Proposal.
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
The object like above might be return, of cause, most of value will be changed **randomly**.

#### Example 9

##### Optional property

The type can define optional property for an object by using function schema.optional.

```JavaScript
  schema.type('Profile', {
    name: String,
    skill: schema.optional(String)
  });
```
Here, skill' is a **optional property**, it can be undefined, BUT, if it has value, the value must be a String.

#### Example 10

##### Operator: And, Or

Dynamic data type of arguments is common in JavaScript. which means we need operator 'Or',

```JavaScript
  schema.assert(x).is(schema.or(String, Number));
```
Here, the value of parameter 'x' can be a String, or can be a Number.

#### Example 11

##### Implement Interfaces

In Java world, we often need make sure a Object must implement Interface A, Interface B... Similarly, operator 'And' can used for this purpose in JavaScript.

```JavaScript
  schema.type('Config',{ //here is definition of type 'Config'
    orderBy:String
    layout: String
  });

 schema.type('Query',{ //here is definition of type 'Query'
    table: String,
    id: Number
  });

 schema.assert(x).is(schema.and(schema.Config, schema.Query)); 
```
Here, we want to make sure the value of 'x' must implement type 'Config', and type 'Query' at same time.

###End

The library duck-type is still developing continually, more interesting feature will be bring to you. We also except any of your comments. 

----------------
More information can be get by accessing [Wiki page](https://github.com/js-fullstack/duck-type/wiki)

Thanks :) 

