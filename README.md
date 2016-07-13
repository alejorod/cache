# Function caching in Javascript [![Build Status](https://travis-ci.org/alejorod/cache.svg?branch=master)](https://travis-ci.org/alejorod/cache) [![Coverage Status](https://coveralls.io/repos/github/alejorod/cache/badge.svg?branch=master)](https://coveralls.io/github/alejorod/cache?branch=master)  

Caching function decorator. Supports CommonJs, AMD, ES6 modules and regular
scripts tag.

Basic usage:

```Javascript
import cache from 'cache';

let fetchUsers = cache(200)(() => {
  return fetch('/users');
});
```

```Cache``` implements the decorator pattern. It takes in the milliseconds that the cache
should be valid and returns a function. Call it with the function you want to cache and
enjoy the application performance upgrade! 😎

> TIP: use Infinity time for stateless functions.

### Examples

```Javascript
// es7 decorators

import cache from 'cache';

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

import cache from 'cache';

let fetchUsers = cache(200)(fetch.bind(null, '/users'));
```

```Javascript
// es5 + node

var cache = require('cache');

var sumLongArray = cache(Infinity)(function(longArray) {
  return longArray.reduce(function(prev, curr) {
    return prev + curr;
  });
});
```

```Javascript
// es5 + browser

// Include it in your page using:
// <script src="lib/cache.js" ></script>

var sqrt = cache(Infinity)(Math.sqrt);
```
