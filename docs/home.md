Welcome to JavaScript library "duck-type", a **schema** and **validate** library, which provide a natural way to define and validate your data structure in JavaScript. 

Why is **"duck type"**, or what is so-called **"duck typing"**? The name of the library came from [wikipedia](https://en.wikipedia.org/wiki/Duck_typing).

>The name of the concept refers to the **duck test**, attributed to James Whitcomb Riley, which may be phrased as follows:    
    **_When I see a bird that walks like a duck and swims like a duck and quacks like a duck, I call that bird a duck._**        
In duck typing, a programmer is only concerned with ensuring that objects behave as demanded of them in a given context, rather than ensuring that they are of a specific class.

In Java world, duck typing was supported by interface, in JavaScript, duck typing was more nature. We needn't predefine **Class or Date Structure** before we use it. "Object" is enough. Relative to Java, JavaScript is more easy to build up program. That is also one reason of why I like JavaScript.

But when program was growing up bigger and bigger, or I have to teamwork with other peoples, I found I began to miss **Type/Class/Schema** more and more.

For example, when I try to reuse a function, but I don't know what parameter should pass to the function unless I have read full of the code. I mean,

```JavaScript
  function foo(config, in) {
    ...
    // How could u know what are "config" and "in"?
    // Especially more than 300 lines code but a few comments write here.
    ...
  }
```

This could not be a problem in Java.

```Java
  void function foo(Config config, InputStream in) {
    ...
    // We can know what is "config", and what is "in" clearly, 
    // even before reading any code of implements, 
    // because there were Class declared before each of parameters.
    ...  
  }
```

Another Example:
The function named 'foo' have worked correctly for long time, but  recently, it dose not work **sometimes**, more strange is 'Unit Test' was passed. What happened? Who changed code? 

```JavaScript
  function foo(config, in) {
    ...
    // We have to debug the code line by line, if error stack was hard to understand. 
    ...
  }
```

One of possible root cause was that parameters was changed by some of callers. But what if there are hundreds call on the function? Maybe, at last,  we found the error was imported by a **refactor** a week ago, we have removed a property of parameter "config" at that time.

"Build up easily, but maintain hardly" is impression of JavaScript for many peoples. Many errors were occured just because we are dealing with unexpected arguments.  

The languages like Java/C/C++ are better to solve the issues like above. Compiler protect us to avoid many error by **Type/Class Predefine**. but we also pay lot of cost for it meanwhile. We have to predefine everything, even we only use an object internally or temporarily.

We are not intend to talk about which language is better. The only thing we want to do is try to avoid the drawback cause by missing type define in JavaScript.

duck-type is JavaScript library, it try to **alleviate** the pain like above by importing "Type Checking" into JavaScript, exactly to say ["Duck Typing Test"](https://en.wikipedia.org/wiki/Duck_typing). In fact, the library is one implementation of ["Interface Pattern"](http://).

Let's take a example:

Suppose, we have predefined type "Config" and "InputStream" already.

```JavaScript
  duck.type('Config', {         // here, we define a type named 'Config'
    size: Number,              // the object must have the property named size, and the value of it must be a number
    buffered: Boolean,         // ...  
    outputFilePath: String     // ...
  });
```

```JavaScript
  duck.type('InputStream', {         // here, we define a type named 'InputStream'
    read: Function                  // the object must have the method named read
  });
```

Then, we can use it at anywhere like this:

```JavaScript
  function foo(config, in) {
    duck(config, in).are(duck.Config, duck.InputStream);   // put this always first line after function declaration.
    ...
  }
```

Now, whenever we open the code, we can know what is exactly the parameter "Config" and "In". And the special Error will be thrown if illegal arguments was passed in. 

There are some questions about this library often be asked:

* **Why don't write validation code at begin of the code?**

    Yes, 'duck-type' can do part of work of validation. But there are two reasons to use duck-type rather than just to write validation code:

    * Type define can be more semantic, and the way is more simple and more unified.

    * Type define can be reuse, even when define new type.

* **Could "duck-type" avoid all of "Type Error", just like language Java/C/C++ ?**

    No, it couldn't do that without compiler :) 

    It only can throw Error at run-time. And even so, it is still better than nothing to do. At least, it can quick failure when the input parameter or result of some function call is not match what you predict, rather than transmit the error continue. Thinking about this, how many times, we found the root cause was hide in deep stack, just because the property of "xxx" was undefined, Or String "123" was passed when we expected a Number 123.

* **Do we need define everything before used ? Just like what we have done in the Java?**

    No, absolutely not. It will be boring and tedious if you do this. 

    Just use it at coarse-grained interface. For example: Facade Interface, published API. Published Type as part of your API was make your program more readable. 

    Or used it somewhere you have teamwork with others. Defensive programming is necessary at this time, 

Fine. that is all. Please see ["Getting Started"](https://github.com/js-fullstack/duck-type/wiki/Getting-Started) if you still have interesting of the library: duck-type.