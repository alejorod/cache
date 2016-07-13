export default function cache(time) {
  return function(f) {
    let result_cache = {};

    return function() {
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
