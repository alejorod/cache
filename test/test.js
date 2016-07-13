import { assert } from 'chai';
import cache from '../src/cache';

describe('Cache', () => {
  describe('# Cache lifetime', () => {
    let result;

    function globalResult() {
      return result;
    }

    describe('## Infinity cache', () => {
      let cachedGlobalResult = cache(Infinity)(globalResult);

      it('should always return the same result', () => {
        result = 'test';
        assert('test', cachedGlobalResult());
        result = 'other';
        assert('test', cachedGlobalResult());
      });
    });

    describe('## .5s cache', () => {
      let cachedGlobalResult = cache(500)(globalResult);

      it('should return the same result in a .5s frame', () => {
        result = 'test';
        assert('test', cachedGlobalResult());
        result = 'other';
        assert('test', cachedGlobalResult());
      });

      it('should return an updated result after .5s', (done) => {
        result = 'test';
        assert('test', cachedGlobalResult());
        result = 'other';
        assert('test', cachedGlobalResult());
        setTimeout(() => {
          assert('other', cachedGlobalResult());
          done();
        }, 600);
      });
    });
  });

  describe('# Cache Arguments', () => {
    function sum(a, b) {
      return a + b;
    }

    function sumArray(array) {
      return array.reduce(function(prev, curr) {
        return prev + curr;
      });
    }

    function concatObject(obj) {
      let key;
      let word = '';

      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          word += key + obj[key];
        }
      }

      return word;
    }

    describe('## Primitive arguments', () => {
      let cachedSum = cache(Infinity)(sum);

      it('same arguments should return the same result', () => {
        assert(4, cachedSum(2, 2));
        assert(4, cachedSum(2, 2));
      });

      it('different arguments should return different results', () => {
        assert(4, cachedSum(2, 2));
        assert(6, cachedSum(2, 4));
      });
    });

    describe('## Array arguments', () => {
      let cachedSumArray = cache(Infinity)(sumArray);

      it('should use cache with different arrays but same values', () => {
        assert(10, cachedSumArray([1,2,3,4]));
        assert(10, cachedSumArray([1,2,3,4]));
      });

      it('shouldn\'t use cached result if array changes', () => {
        let arr = [1, 2, 3, 4];
        assert(10, cachedSumArray(arr));
        arr.push(5);
        assert(15, cachedSumArray(arr));
      });
    });

    describe('## Object arguments', () => {
      let cachedConcatObject = cache(Infinity)(concatObject);

      it('should use cache with different objects but same values', () => {
        assert('namejhonlastnamedoe', cachedConcatObject({
          name: 'jhon',
          lastname: 'doe'
        }));

        assert('namejhonlastnamedoe', cachedConcatObject({
          name: 'jhon',
          lastname: 'doe'
        }));
      });

      it('shouldn\'t use cached result if object changes', () => {
        let obj = {
          name: 'jhon',
          lastname: 'doe'
        };

        assert('namejhonlastnamedoe', cachedConcatObject(obj));
        obj.name = 'jon';
        assert('namejonlastnamedoe', cachedConcatObject(obj));
      });
    });
  });

  describe('# Javascript Builtins', () => {
    it('cached builtin functions should behave the same as builtins', () => {
      let cachedSqrt = cache(Infinity)(Math.sqrt);
      let cachedMax = cache(Infinity)(Math.max);
      let cacheCos = cache(Infinity)(Math.cos);

      assert(cachedSqrt(4), Math.sqrt(4));
      assert(2, cachedSqrt(4));

      assert(cachedMax(1, 2), Math.max(1, 2));
      assert(2, cachedMax(1, 2));

      assert(cacheCos(Math.PI), Math.cos(Math.PI));
      assert(-1, cacheCos(Math.PI));
    });
  });

  describe('# Caching Promises', () => {
    let promiseResult = 'promise';
    let cachePromiseResolve;

    function promiseResolve() {
      return new Promise((resolve) => {
        resolve(promiseResult);
      });
    }

    cachePromiseResolve = cache(Infinity)(promiseResolve);

    it('should cache & return the promise with the correct result', (done) => {
      cachePromiseResolve().then((result) => {
        assert('promise', result);
      }).then(() => {
        promiseResult = 'notcached';

        return cachePromiseResolve().then((result) => {
          assert('promise', result);
        });
      }).then(() => {
        promiseResolve().then((result) => {
          assert('notcached', result);
          done();
        });
      });
    });
  });

  describe('# Class Method cache', () => {
    let name = 'jon snow';
    let dummy;

    class DummyClass {
      @cache(Infinity)
      getGlobalName() {
        return name;
      }
    }

    dummy = new DummyClass();

    it('# should return the cached value', () => {
      assert('jon snow', dummy.getGlobalName());
      name = 'ygritte';
      assert('jon snow', dummy.getGlobalName());
    });
  });
});
