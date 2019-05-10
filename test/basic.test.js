const basic = require('../src/basic');
const assert = require('assert');

function rangeTest(min, max) {
  for(const item of basic.range(max, min)) {
    assert(item >= min);
    assert(item < max);
  }
}

function composeTest(args, size) {
  const composition = [...basic.compose(...args)];
  assert(composition.length === size);
  for(const item of composition) {
    assert(item.length === args.length);
  }
}

describe('basic', function () {
  it('range 200', () => rangeTest(-100, 100));
  it('range 1', () => rangeTest(10, 11));
  it('range 0', () => rangeTest(10, 10));
  it('range -5', () => rangeTest(10, 5));

  it('compose', () => {
    const vector = [3, 2, 5];
    composeTest(vector.map(a => [...basic.range(a)]), vector.reduce(basic.multiply, 1))
  });
});
