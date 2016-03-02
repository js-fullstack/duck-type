### Content Table
* [Preface](#preface)
* [assert, is, are](#assert-is-are)
  * [assert](#assert)
  * [is](#is)
  * [are](#are)
* [Build-In type](build-In-type)
* [Null & undefined](#null--undefined)
  * [NULL](#null)
  * [UNDEFINED](#undefined)
* [Class/Constructor & Prototype](#classconstructor--prototype)
  * [Constructor](#constructor)
  * [Prototype](#prototype)
  * [Inherited](#inherited)
* [Validation function](#validation-function)
* [Array](#array)
  * [Pattern one](#pattern-one)
  * [Pattern two](#pattern-two)
  * [Pattern three](#pattern-three)
* [Object](#object)
  * [Basic](#basic)
  * [Nest Object](#nest-object)
* [Type define & Inline validation](#type-define--inline-validation)
  * [Inline validation](#inline-validation)
  * [Type define](#type-define)
  * [Alias](#alias)
  * [Reuse Definition](#reuse-definetion)
  * [Partially](#partially)
* [Operator](#operator)
  * [and](#and)
  * [or](#or)
  * [optional](#optional)
  * [nullable](#nullable)
  * [parameterize](#parameterize)
  * [asPrototype](#asPrototype)
* [Mute](#mute)
  * [mute(function)](#mutefunction)
  * [mute(true/false)](#mutetruefalse)
* [Generate](#generate)
* [validation function](#validation-function)
* [Instance & bind](#Instance--bind)
  * [instance](#instance)
  * [exports with node module](#exports-with-node-module)


### Preface

Most concept of "duck-type" was introduced in ["Home"](https://github.com/js-fullstack/duck-type/wiki/Home) page. Reading ["Getting Started"](https://github.com/js-fullstack/duck-type/wiki/Getting-Started) might be a good beginning to know about the library. This document was intended to show the details about using "duck-type".

Currently, duck-type can support both NodeJS and browser:

```Bash
   ## in node
   npm install duck-type
```

and, use it in your code, like:

```javascript
  // in node 
  var schema = require('../duck-type').create();
```

Or

```Bash
   ## in browser
   bower intall duck-type
```

and, use it in your code, like:

```javascript
  // in browser, global variable  duckType
  var schema = duckType.create();
```

It also support **"requirejs"**.

Here `schema` was just a variable, you can change it to any variable which you like, but we just use ***"schema"*** to reference it in following document. It is the entry point of our library. `x`,`y`,`z`... will be used as reference variable which need to be verify.

### assert, is, are

#### assert

```JavaScript
  schema.assert(x);  // create a Duck object, which will be used to do judgement
  schema(x);         // as same as schema.assert, also return Duck object, we will use this pattern in other examples. 
```


#### is

`Duck.is` is used to verify the type of single variable. Example:
```JavaScript
  schema(x).is(Number);   // the statement will return true if x a is Number; 
```

The "true" will be return if test passed. If test is not passed, the **"Error" will be thrown** in most situation except in ***"mute block"***, we will introduce "mute block" later, see [mute](#mute).

#### are

`Duck.are` is used to verify multiple variables. Example:

```JavaScript
  // the statement will return true if x a is Number and y is a String, and z is a Date ;
  schema(x, y, z).are(Number, String, Date);   
```


### Build-In type

The following Build-In was supported:

```JavaScript
  schema(x).is(String);     // both 'hello' or new String('hello') can be passed
  schema(x).is(Number);     // both 1, 1.1 or new Number(1) can be passed
  schema(x).is(Boolean);    // both true, or new Boolean(true) can be passed
  schema(x).is(Date);       // var d = new Date(), d can be passed
  schema(x).is(Array);      // any array will be passed
  schema(x).is(Object);     // any thing except "undefined" can be passed, include {}, new Object(), null,1,'hello',new Date(), even function(){}
  schema(x).is(Function);   // any function can be passed.
  schema(x).is(RegExp);     // both /^\.*$/ or new RegExp('^\.*$') can be passed

```

### Null & undefined

#### NULL

`null` can be verified by `schema.NULL`. Example:

```JavaScript
  schema(x).is(schema.NULL);
```

#### UNDEFINED

`undefined` can be verified by `schema.UNDEFINED`. Example:

```JavaScript
  schema(x).is(schema.UNDEFINED);
```

### Class/Constructor & Prototype 

#### Constructor

In JavaScript, a function can be "Constructor". Example:

```JavaScript
  function Person(name, age) {
    this.name = name || '';
    this.age = age || 10;
  }

  Person.prototype = {
    ...
  }
```

This can be supported in "duck-type". Example:

```JavaScript
  schema(x).is(Person);   //Person is Constructor function
```

In fact, all of build-in type were implemented by Constructor function verify.

#### Prototype

"prototype" was also supported by "duck-type", see details in [***"Operator schema.asPrototype"***](#asPrototype)

#### Inherited

Inherited in JavaScript could be like this:

```JavaScript
  function Person() { ... }           // constructor of "Person"

  function Student() { ... }          // constructor of "Student"

  Student.prototype = new Person();   // now, "Student" was inherited from "Person"

  var x = new Student();              // x is a instance of "Student" and "Person"
```

It has been supported like:

```JavaScript
  duck(x).is(Student);     // it will be passed;
  duck(x).is(Person);      // it also will be passed;
  duck(x).is(Object);      // it will passed;
```

### Validation function

#### Validation function

We can define a callback function as a validator. For example, we want make sure variable "x" should be positive number:

```JavaScript
  duck(x).is(function(value) {                     // the value of "x" will be passed to parameter "value" when validator function was called.
    return duck(value).is(Number) && value > 0;    // the "true/false" must be return in validator function
  }); 
```
***Comments***
* value will be passed as target object which is waiting for verifying.
* true/false should be return in validator function.
* `Duck.is` or `Duck.are` can be used in validator function, it will return true if test passed, **BUT**, it will return false if test failure rather than thrown any 'Error', just like in **"mute block"**.
* How can we distinguish **"Constructor function"** and **"validator call back function"**, **"Constructor function"** has **"name"**, **"validator call back function"** must be a anonymous function. Or you can define **"validator call back function"** by `schema.validator`, see ["validator"](#validator)

### Array

"duck-type" support "Array" very flexibly, there are three pattern to verify an object is a instance of "Array".

#### Pattern one

```JavaScript
  schema(x).is([]);     // it is as same as schema(x).is(Array);
```

The test will be passed, if x is an instance of Array, don't care whether length of the array or type of each element in the array.

#### Pattern two

```JavaScirpt
  schema(x).is([Number]);  // any type define which we mentioned above can put into here, like schema(x).is(String)
```

This is equivalent of Array definition in 'Java'. The test will be passed if x is an instance of Array, **and** each element of the array must be a Number (empty will also be passed).

#### Pattern three

```JavaScript
  schema(x).is([String, Number, Date]);
```

The test will be passed if "x" is an instance of Array, and the length of the array must great or equals 3, the type of the first element must be a String, the second must be a Number, the third must be a Date.

```JavaScript
  schema(x).is([[String,Number]]); // it also support 'nest' array
``` 
 
### Object

#### Basic
"duck-type" support Object in **a natural way**, Example:
```JavaScript
  schema(x).is({
    name: String,
    birthday: Date,
    address: String,
    sendEmail: Function
  });
```
See, It's easy to understand, we needn't to design additional grammar. 

**Note:** The test will passed only if the properties declared here must be matched exactly, Including name of properties and type of them. **But**, it doesn't matter if x has others properties of method which not be declared here.

```JavaScirpt
var x = {                       // it can be passed duck type test
  name:'foo',
  birthday: new Date(),
  address: 'somewhere',        
  city: 'New York',             // additional property couldn't cause test failure.
  sendEmail: function() {...},
  sayHello: function() {...}    // additional method couldn't cause test failure.
};
```
```JavaScirpt
var x = {                       // it could not be passed duck type test because missing method "sandEmail"
  name:'foo',
  birthday: new Date(),
  address: 'somewhere, US'
};
```
That is so-call **"duck type test"**.

#### Nest Object

Complicated Object Structure was supported, for example:

```JavaScript
  schema(x).is({
    name: {                     // property "name" is a "Nest Object" declaration.
      first: String,
      last: String
    },
    email: String,
    skills: [{                  // property "skills" is Array declaration. Each element of it is also a "Next Object" declaration
      name:String,
      Level:String
    }]
  }); 
```

### Type define & Inline validation

#### Inline validation

All of examples above, `schema(x).is(...)` validate type/structure of x directly, we call them **"Inline validation"**.

#### Type define

Relative to **"Inline validation"**, we also can **"Predefine Type"**, then reuse them when verifying. 

`schema.type` is used to define a new **"type"**. Example:

```JavaScript
  schema.type('Person', {
    name: String,
    age: Number,
    birthday: Date,
    sayHello: Function
  })
```

Here, we defined a "duck type" named "Person", and an object can be seen as a "Person" is it has properties "name", "age", "birthday", and types of them must be "String", "Number", "Date", and it also must have method named "sayHello"   

After type define, we can reference it by **"schema.XXX"**, "XXX" was name of type, for example continue above:

```JavaScript
  schema(x).is(schema.Person);
```

There is a **convention** when naming type in "duck-type", the name of type must be a legal variable in JavaScript, and first character must be a **capital letter**

**"Validator function"** can also be defined as a "Type"

```JavaScript
  schema.type('Integer', function() {
    return schema(value).is(Number) &&
      value % 1 === 0 &&
      value >= -2147483648 && value <= 2147483647
  }); 
```

Know, we can use it like:

```JavaScript
  schema(x).is(schema.Integer);
```

#### Alias

Alias was also supported by `schema.type`

```JavaScript
  schema.type('Double',Number);
```
Here, "Double" was alias of Number. 

#### Reuse Definition

"Type" which already defined can be used when we define new "type", for example, if `schema.Integer` have been defined already (see example above):

```JavaScript
  schema.type('Person',{
    id: schema.Integer,     // here, we reuse Integer which we have defined before
    name: String
    ...
  });
```

For another example, "Skill" was a type:

```JavaScript
  schema.type('Skill',{
    name: String,
    level: schema.Integer    // here, we reuse Integer which we have defined before
  });
```

Then, we can reuse definition of "Skill" like:

```JavaScript
  schema.type('Person',{
    id: schema.Integer,      // here, we reuse Integer which we have defined before
    name: String
    ...
    skills:[schema.Skill]    // here, we reuse Skill which we have defined before
  });
```

Base on this, we can build up reusable "Type" in our program.

#### Partially

In some scenario, we have defined a "Big" type already, for example:

```JavaScript
  schema.type('Person',{
    name: {                     // property "name" is a "Nest Object" declaration.
      first: String,
      last: String
    },
    email: String,
    skills: [{                  // property "skills" is Array declaration. Each element of it is also a "Next Object" declaration
      name:String,
      Level:String
    }]
  });
```

But what we deal with in current program is just a part of "Person", for example, name of "Person":

```JavaScript
  schema(x).is(schema.Person.name)   // thus, "first: String" and "last: String" are required properties of x. 
```

We call verification like this **"Partially"**. It is useful when we deal with "Type" which defined by other team.

We can define new "Type" even base on **"Partially"**, for example:

```JavaScript
  schema.type('Contact',{
    id: schema.Ineger,               // here, we reuse Integer which we have defined before
    userName: schema.Person.name,    // here, we partially reuse Person, property name 
    mail: schema.Person.email        // here, we partially reuse Person, property email
  });
```

### Operator

#### and

We can use `schema.and` to verify an object is compatible with multiple type definition at same time, just like we have done with **"Interface"** in Java. For example :

```JavaScript
  schema.type('Foo', {
    name: String,
    birthday: Date
  });

  schema.type('Savable', {
    save: Function
  })

  var person = {
    name : 'test',
    birthday: new Date(),
    save: function() {...}
  }

  schema(person).is(schema.and(schema.Foo, schema.Savable));  // it will be passed. 
```

#### or

Sometimes, the parameters can be be an object with different type, many examples like this can be seen in **"JQuery"**. duck-type support `schema.or` for this case.

```JavaScript
  schema.type('Config', {
     ....
  });

  schema(x).is(schema.or(String, schema.Config));    // it will be passed, if x is either a String or a Config object  
```

#### optional

`schema.optional` means it can be undefined, but if it has value, it must be a some type, for example:

```JavaScript
  schema.type('Person', {
    name: String,
    birthday: schema.optional(Date)    // the property 'birthday' is optional, it can be undefined or an instance of Date 
  })
```

#### nullable

Like `schema.optional` above, nullable means value can be null or some type:

```JavaScript
  schema(x).is(schema.nullable(String));  // it can be passed if x is a String, or null. 
```
**Note:** `nullable` should be used unusual in JavaScript, `optional` should be seen often. 

#### parameterize

The type definition can include parameter, for example:

```JavaScript
  schema.type('VARCHAR', schema.parameterize(function(value, length) {              // here, 'VARCHAR' was defined
    return schema(value).is(String) && value.lenght <= lenght;
  }));

  duck(x).is(VARCHAR(20))                                     // the value '20' will be passed to validation function as agument 'lenght', and 'x' will be pass to validation function as argument value.
```

In other example, `NUMBER` could be defined with min and max value. 

```JavaScript
  schema.type('NUMBER', schema.parameterize(function(value, min, max) {              // here, 'VARCHAR' was defined
    return duck(value).is(String) && value <= max && value >= min;
  }));

  schema(x).is(VARCHAR(20))                                     // the value '20' will be passed to validation function as argument 'length', and 'x' will be pass to validation function as argument value.
```

#### asPrototype

Sometimes, the object was create from a prototype object, like:

```JavaScript
  var Person = {                     // here, "Person" is prototype object
    name : '',
    age: 10
  }

  var x = Object.create(Person);    // here, "x" is created by prototype "Person"
```

`schema.asPrototype` was designed as to verify prototype. Example:

```JavaScript
  schema(x).is(schema.asPrototype(Person));
``` 

### Mute

`schema.is` or `schema.are` will throw `IncompatibleTypeError` if duck type test failed. It also can be return false, if we use **"mute function"** or **"mute true/false"**

#### mute(function)

```JavaScript
  schema.mute(function() {      // this is mute function, or so-called mute block
    if(schema(x).is(String)) {  // it will return false, rather than throw `IncompatibleTypeError`
      //do something
    } else {
      ...
    };      
  });
```
#### mute(true/false)

`schema(true) or schema(false)` can also be used, some result with **"mute block"**
```JavaScript
  schema.mute(true);
  try {
    if(schema(x).is(String)) {  // it will return false, rather than throw `IncompatibleTypeError`
      //do something
    } else {
      ...
    };   
  } finally {
    schema.mute(false);        // put them in try/finally block is recommended.
  }
  ...

```

### Mock
`schema.mock` can generate **"mock data"**, for example:

```JavaScript
  schema.mock(String);         // a random String will be returned
  schema.mock(Number);         // a random Number will be returned
 
  schema.type('Person', {
    name: String,
    birthday: Date
  });

  schema.mock(schema.Person);     // a instance of Person will be return, it contains properties name and birthday.
```

### validation function

We can defined our type like example **"Integer"**

```JavaScript
  schema.type('Integer', function() {
    return schema(value).is(Number) &&
      value % 1 === 0 &&
      value >= -2147483648 && value <= 2147483647
  }); 
```

`schema.validator` is a function more recommended when we define new type:

```JavaScript
  schema.validator(typeDefineFunction, mockHandler, errorHandler); 
```

**mockHandler** is a function which will be call when mock. for example: `schema.mock(schema.Integer)`.

**errorHandler** is a function which will be call when `IncompatibleTypeError` be thrown, the function will determine the type error massage.

### Instance & bind

#### instance

`instance` will be used as entry point of duck-type, for example:

```JavaScript
  var schema = require('../duck-type').instance();
```

#### exports with node module

`bind` will export all of types which you defined to target object, it can be used as **export type**, for example:

`bind` is **unstable API**, it is likely to changed in future.

In module A,
```JavaScript
  //in module a, define your types
  schema.type('Person', {...});
  schema.type('Skill', {});
  ...

  //export something of current module
  module.exports = .....;

  schema.bind(module.exports);   // it will binding type of 'Person', 'Skill'... to current module
```

In module B, we need use typed defined in module A:
```
  var moduleA = require('a.js');
  ...
  schema(x).is(moduleA.Person);  // it can work;

  ...

  schema.type('Profile', {
    Person: moduleA.Person,    // 'moduleA.Person' can also be reference in type definition.
    ...
  })
 
```