/**
 * @param fn
 * @returns {function(*=): *}
 */
function cache(fn) {
  const cached = function (s) {
    if (!cached.cache[s]) {
      cached.cache[s] = fn(s);
    }
    return cached.cache[s];
  };
  cached.cache = [];
  cached.cache.for = (...args) => args.map(arg => cached(arg));
  return cached;
}

module.exports = cache;
