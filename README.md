# TodoMVC - Source Code Review Exercises

This project is based on the Practical Javascript TodoMVC series.

## Original Code

Use the code here as the starting point for these exercises:
https://glitch.com/edit/#!/maze-stealer?path=public/js/app.js


## Step 1 - Make everything a function

Take the code above and rewrite it such that there are 
no methods defined in app.js. None, not even one.
Here's a concrete example: 

If you have this in your app:

```javascript
var myObject = {
  sayHello: function () {
    console.log('hello!');
  }
};
```

You should rewrite it so that it looks like this:

```javascript
function sayHello() {
  console.log('hello!');
}
```

## Step 2 - Remove jQuery

Make the application work exactly as the original code but do so without any jQuery. For example, remove jQuery from app.js method-by-method (create, destroy, etc). Once you’re done, remove the jQuery script tag from index.html (line 56 of original code).

If successful, everything in your modified application should work exactly as it did in the original application. 
