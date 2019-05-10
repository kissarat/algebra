function* range(s, i = 0) {
  for (; i < s; i++) {
    yield i
  }
}

function* filter(items, check) {
  for (const item of items) {
    if (check(item)) {
      yield item;
    }
  }
}


function* compose(items, ...args) {
  if (args.length > 0) {
    for (const item of items) {
      for (const part of compose(...args)) {
        yield [item, ...part]
      }
    }
  }
  else {
    for (const item of items) {
      yield [item];
    }
  }
}

function* space(...args) {
  yield* compose(...args.map(arg => Array.from(range(arg))))
}

function* map(A, fn) {
  for (const a of A) {
    yield fn(a);
  }
}

function random(max = 10, min = 0) {
  return min + Math.floor(max * Math.random())
}

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = {
  range,
  filter,
  compose,
  space,
  map,
  random,
  add,
  multiply,
  zero: () => 0,
  one: () => 1,
};
