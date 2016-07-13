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

      result = f.apply(f, args);

      f_cache[key] = {
        timestamp: now,
        result
      };

      return result;
    };

    wrapper.clearCache = clearCache;
    return wrapper;
  };
}

export default function(time) {
  return function(target, property, descriptor) {
    if (typeof target == 'function') {
      return cacheFn(time)(target);
    }

    descriptor.value = cacheFn(time)(descriptor.value);
    return descriptor;
  };
}
