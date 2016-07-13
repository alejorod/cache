# Function caching in Javascript [![Build Status](https://travis-ci.org/alejorod/cache.svg?branch=master)](https://travis-ci.org/alejorod/cache) [![Coverage Status](https://coveralls.io/repos/github/alejorod/cache/badge.svg?branch=master)](https://coveralls.io/github/alejorod/cache?branch=master)  

Caching function results decorator. Supports node and browser environments (umd specification)

### Examples

```Javascript
// es5

var cache = require('cache');

var sumLongArray = cache(Infinity)(function(longArray) {
  return longArray.reduce(function(prev, curr) {
    return prev + curr;
  });
});
```

```Javascript
// es6

import cache from 'cache';

let fetchUsers = cache(200)(fetch.bind(null, '/users'));
```

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
