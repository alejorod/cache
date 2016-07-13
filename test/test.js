import { assert } from 'chai';
import cache from '../src/cache';

var result;
function globalResult() {
  return result;
}

function sum(a, b) {
  return a + b;
}

function sumArray(array) {
  return array.reduce(function(prev, curr) {
    return prev + curr;
  });
}

function concatObject(obj) {
  var word = '';

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      word += key + obj[key];
    }
  }

  return word;
}

var promiseResult = 'promise';

function promiseResolve() {
  return new Promise(function(resolve) {
    resolve(promiseResult);
  });
}

describe('Function Cache', function() {
  describe('# Infinity cache', function() {
    var cachedGlobalResult = cache(Infinity)(globalResult);

    it('should always return the same result', function() {
      result = 'test';
      assert('test', cachedGlobalResult());
      result = 'other';
      assert('test', cachedGlobalResult());
    });
  });

  describe('# .5s cache', function() {
    var cachedGlobalResult = cache(500)(globalResult);

    it('should return the same result in a .5s frame', function() {
      result = 'test';
      assert('test', cachedGlobalResult());
      result = 'other';
      assert('test', cachedGlobalResult());
    });

    it('should return an updated result after .5s', function(done) {
      result = 'test';
      assert('test', cachedGlobalResult());
      result = 'other';
      assert('test', cachedGlobalResult());
      setTimeout(function() {
        assert('other', cachedGlobalResult());
        done();
      }, 600);
    });
  });

  describe('# Primitive arguments', function() {
    var cachedSum = cache(Infinity)(sum);
    it('same arguments should return the same result', function() {
      assert(4, cachedSum(2, 2));
      assert(4, cachedSum(2, 2));
    });

    it('different arguments should return different results', function() {
      assert(4, cachedSum(2, 2));
      assert(6, cachedSum(2, 4));
    });
  });

  describe('# Array arguments', function() {
    var cachedSumArray = cache(Infinity)(sumArray);

    it('should use cache with different arrays but same values', function() {
      assert(10, cachedSumArray([1,2,3,4]));
      assert(10, cachedSumArray([1,2,3,4]));
    });

    it('shouldn\'t use cached result if array changes', function() {
      var arr = [1, 2, 3, 4];
      assert(10, cachedSumArray(arr));
      arr.push(5);
      assert(15, cachedSumArray(arr));
    });
  });

  describe('# Object arguments', function() {
    var cachedConcatObject = cache(Infinity)(concatObject);

    it('should use cache with different objects but same values', function() {
      assert('namejhonlastnamedoe', cachedConcatObject({
        name: 'jhon',
        lastname: 'doe'
      }));

      assert('namejhonlastnamedoe', cachedConcatObject({
        name: 'jhon',
        lastname: 'doe'
      }));
    });

    it('shouldn\'t use cached result if object changes', function() {
      var obj = {
        name: 'jhon',
        lastname: 'doe'
      };

      assert('namejhonlastnamedoe', cachedConcatObject(obj));
      obj.name = 'jon';
      assert('namejonlastnamedoe', cachedConcatObject(obj));
    });
  });

  describe('# Javascript Builtins', function() {
    it('cached function should behave the same as builtins', function() {
      var cachedSqrt = cache(Infinity)(Math.sqrt);
      var cachedMax = cache(Infinity)(Math.max);
      var cacheCos = cache(Infinity)(Math.cos);

      assert(cachedSqrt(4), Math.sqrt(4));
      assert(2, cachedSqrt(4));

      assert(cachedMax(1, 2), Math.max(1, 2));
      assert(2, cachedMax(1, 2));

      assert(cacheCos(Math.PI), Math.cos(Math.PI));
      assert(-1, cacheCos(Math.PI));
    });
  });

  describe('# Returning Promises', function() {
    var cachePromiseResolve = cache(Infinity)(promiseResolve);

    it('should cache the correct promise', function(done) {
      cachePromiseResolve().then(function(result) {
        assert('promise', result);
      }).then(function() {
        promiseResult = 'notcached';

        cachePromiseResolve().then(function(result) {
          assert('promise', result);
        });
      }).then(function() {
        promiseResolve().then(function(result) {
          assert('notcached', result);
          done();
        });
      });
    });
  });
});
