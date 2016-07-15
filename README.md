# Function caching in Javascript [![Build Status](https://travis-ci.org/alejorod/cache.svg?branch=master)](https://travis-ci.org/alejorod/cache) [![Coverage Status](https://coveralls.io/repos/github/alejorod/cache/badge.svg?branch=master)](https://coveralls.io/github/alejorod/cache?branch=master) [![npm version](https://badge.fury.io/js/fn-cache.svg)](https://badge.fury.io/js/fn-cache)  

Cache for functions in javascript. Supports CommonJs, AMD, ES6 modules and regular script tag.

Basic usage:

```Javascript
import cache from 'fn-cache';

let fetchUsers = cache(200)(() => {
  return fetch('/users');
});
```

```fn-cache``` implements the decorator pattern. It takes in the cache lifetime (milliseconds) and returns a function. Call that with the function you want to cache and enjoy instant application performance boost! 😎

> TIP: Use ```Infinity``` time if you want the cache to stay valid forever.

### Installation
```
npm install fn-cache
```

### Usage

```fn-cache``` can cache regular function or class methods. It can be used as a regular function or as a ES7 decorator 💪.  
To clear cache, each decorated function is added a ```clearCache``` method that when called, clears that function cache.  

##### ES7 - decorator

> Cache methods are **autobinded**

```Javascript
import cache from 'fn-cache';

class UserManager {

  constructor(usersEndpoint) {
    this.endpoint = usersEndpoint;
  }

  // cache will be vaild for 200 milliseconds
  @cache(200)
  getAll() {
    // this.endpoint gets the right value 
    // because  getAll is autobinded
    return fetch(this.endpoint).then((response) => {
      return response.json();
    });
  }
}

let manager = new UserManager('/users');

// calling the cache function works as expected
manager.getAll();

// we can clear the cache by calling clearCache
// although its no necessary most of the times
manager.getAll.clearCache()
```

##### ES6

```Javascript

import cache from 'fn-cache';

function reallyExpensive(...args) {
  // expensive operations
  return expensiveToCalculateResult;
}

// We don't want the cache to be invalidated, thats why we use
// Infinity, if you want to give the cache a lifetime, just pass
// in a {Number} representing milliseconds.
let fetchUsers = cache(Infinity)(fetch.bind(null, '/users'));
```

##### ES5 - Node

```Javascript

var cache = require('fn-cache');

var sumLongArray = cache(Infinity)(function(longArray) {
  return longArray.reduce(function(prev, curr) {
    return prev + curr;
  });
});
```

##### ES5 - Browser

> Include ```<script src="lib/fn-cache.js" ></script>``` in your page

```Javascript
var sqrt = fnCache(Infinity)(Math.sqrt);
```
