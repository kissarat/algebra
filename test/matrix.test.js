const matrix = require('../src/matrix');
const basic = require('../src/basic');
const assert = require('assert');

function rangeTest(min, max) {
  for (const item of basic.range(max, min)) {
    assert(item >= min);
    assert(item < max);
  }
}

const print = A => console.log(matrix.pretty(A) + '\n');

function random(max = 5, min = 1) {
  return matrix.random(basic.random(max, min), basic.random(max, min))
}

describe('matrix', function () {
  it('create', function () {
    const A = random();
    const [x, y] = matrix.size(A);
    const B = matrix.create(x, y, (i, j) => A[i][j]);
    assert(matrix.equals(A, B));
  });

  it('transpose', function () {
    const A = random();
    const B = matrix.transpose(A);
    assert(matrix.every(A, (a, i, j) => a === B[j][i]));
  });

  it('identity', function () {
    const A = matrix.identity(basic.random(10, 1));
    assert(matrix.every(A, (a, i, j) => a === (i === j ? 1 : 0)));
  });
});
