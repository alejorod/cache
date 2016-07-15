function cacheFn(time) {
  return function(f) {
    let f_cache = {};

    function clearCache() {
      f_cache = {};
    }

    function wrapper(...args) {

      let key = JSON.stringify(args);
      let cache = f_cache[key];
      let now = Date.now();
      let result;

      if (cache !== undefined && now - cache.timestamp < time) {
        return cache.result;
      }

      result = f.apply(this, args);

      f_cache[key] = {
        timestamp: now,
        result
      };

      return result;
    }

    return (ctx) => {
      let fn = wrapper.bind(ctx);
      fn.clearCache = clearCache;

      return fn;
    };
  };
}

export default function(time) {
  return function(target, property, descriptor) {
    let factory;

    if (typeof target === 'function') {
      return cacheFn(time)(target)();
    }

    factory = cacheFn(time)(descriptor.value);

    return {
      configurable: true,
      get() {
        let boundFn = factory(this);

        Object.defineProperty(this, property, {
          value: boundFn,
          configurable: true,
          writable: true
        });

        return boundFn;
      }
    };

  };
}
