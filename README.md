# Function caching in Javascript [![Build Status](https://travis-ci.org/alejorod/cache.svg?branch=master)](https://travis-ci.org/alejorod/cache) [![Coverage Status](https://coveralls.io/repos/github/alejorod/cache/badge.svg?branch=master)](https://coveralls.io/github/alejorod/cache?branch=master)  

Cache for functions in javascript. Supports CommonJs, AMD, ES6 modules and regular script tag.

Basic usage:

```Javascript
import cache from 'fn-cache';

let fetchUsers = cache(200)(() => {
  return fetch('/users');
});
```

```fn-cache``` implements the decorator pattern. It takes in the cache lifetime (milliseconds) and returns a function. Call that with the function you want to cache and enjoy instant application performance boost! 😎

> TIP: Use Infinity for time if you want the cache to stay valid forever.

### Examples

```Javascript
// es7 decorators

import cache from 'fn-cache';

class UserManager {

  @cache(200)
  getAll() {
    return fetch('/users').then((response) => {
      return response.json();
    });
  }
}
```

```Javascript
// es6

import cache from 'fn-cache';

let fetchUsers = cache(200)(fetch.bind(null, '/users'));
```

```Javascript
// es5 + node

var cache = require('fn-cache');

var sumLongArray = cache(Infinity)(function(longArray) {
  return longArray.reduce(function(prev, curr) {
    return prev + curr;
  });
});
```

```Javascript
// es5 + browser

// Include it in your page using:
// <script src="lib/fn-cache.js" ></script>

var sqrt = fnCache(Infinity)(Math.sqrt);
```
