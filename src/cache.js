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

    wrapper.clearCache = clearCache;

    return wrapper;
  };
}

export default function(time) {
  return function(target, property, descriptor) {
    let cached;

    if (typeof target === 'function') {
      return cacheFn(time)(target);
    }

    cached = cacheFn(time)(descriptor.value);

    return {
      configurable: true,
      get() {
        let boundCached = cached.bind(this);
        boundCached.clearCache = cached.clearCache;

        Object.defineProperty(this, property, {
          value: boundCached,
          configurable: true,
          writable: true
        });

        return boundCached;
      }
    };
  };
}
