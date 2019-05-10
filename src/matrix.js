const {declare, cache, address, expression} = require('./generate');
const basic = require('./basic');

function size(A) {
  return [A.length, A[0].length];
}

function freeze(A) {
  return Object.freeze(A.map(row => Object.freeze(row)));
}

function create(x, y, initial = () => 0) {
  return freeze([...basic.range(x)].map(i => [...basic.range(y)].map(j => initial(i, j))));
}

function index(A) {
  return A.map((row, i) => row.map((item, j) => [i, j, item]))
}

// function assemble(indexed, defaultValue = 0) {
//   return function (i, j) {
//     const found = indexed.find(idx => i === idx[0] && j === idx[1]);
//     return found ? found[2] : defaultValue
//   }
// }

function transpose(A) {
  const [x, y] = size(A);
  return create(y, x, (i, j) => A[j][i]);
}

function zero(size) {
  return create(size, size, (i, j) => i === j ? 1 : 0);
}

function map(A, fn) {
  return freeze(A.map((row, i) => row.map((a, j) => fn(a, i, j))));
}

function every(A, fn) {
  return A.every((row, i) => row.every((a, j) => fn(a, i, j)));
}

function equals(A, B) {
  return every(A, (a, i, j) => a === B[i][j]);
}

function* detFactory(rx, j = 0) {
  if (rx.length === 1) {
    yield address('A', rx[0], j);
    return;
  }
  for (const i of rx) {
    const newRX = rx.filter(ii => ii !== i);
    yield expression(
        (-1) ** (i + j) === -1 ? '-' : '+',
        address('A', i, j),
        '*',
        [...detFactory(newRX, j + 1)]
    );
  }
}

function compute(A, B, op) {
  return create(A.length, B.length, (i, j) => op(A[i][j], B[j][i]));
}

function multiply(A, B) {
  return compute(A, B, basic.multiply)
}

const matrixDet = cache(s => declare(['A'], ...detFactory([...basic.range(s)])));
const det = A => matrixDet(A.length)(A);

function random(x = 4, y = 4, max = 100, min = 0) {
  return create(x, y, () => basic.random(max, min));
}

function pretty(A) {
  return A.map(row => row.join(' ')).join('\n')
}

const identity = cache(s => create(s, s, (i, j) => i === j ? 1 : 0));

function isFinite(A) {
  return every(A, a => Number.isFinite(a));
}

function inverse(A) {
  return multiply(A, identity(A.length));
}

function parse(string) {
  return string.trim().split(/\n/g).map(s => s.trim().split(/\s+/g).map(s => +s))
}

module.exports = {
  size,
  create,
  index,
  transpose,
  zero,
  // assemble,
  det,
  map,
  multiply,
  random,
  pretty,
  every,
  size,
  equals,
  identity,
  isFinite,
  parse
};
