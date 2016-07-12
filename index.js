'use strict';

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
}(this, function () {
  return function (time) {
    return function(f) {
      let result_cache = {};

      return function () {
        let arr_args = Array.prototype.slice.call(arguments);
        let key = JSON.stringify(arr_args);
        let cache = result_cache[key];
        let now = Date.now();
        let result;

        if (cache !== undefined && now - cache.timestamp < time) {
          return cache.result;
        }

        result = f.apply(f, arr_args);

        result_cache[key] = {
          timestamp: now,
          result
        };

        return result;
      }
    }
  }
}));
