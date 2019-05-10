const matrix = require('../src/matrix');
const basic = require('../src/basic');
const assert = require('assert');

function rangeTest(min, max) {
  for (const item of basic.range(max, min)) {
    assert(item >= min);
    assert(item < max);
  }
}

function print(matrices) {
  for(const key in matrices) {
    const m = matrices[key];
    const string = matrix.pretty(m);
    console.log(`${key}:\n${string}\n`);
  }
}

function assertFinite(matrices) {
  for(const key in matrices) {
    const m = matrices[key];
    try {
      assert(matrix.isFinite(m));
    }
    catch (err) {
      console.error(`Elements in matrix ${key} is not finite`);
      print(matrices);
      throw err;
    }
  }
}

function random(max = 5, min = 1) {
  return matrix.random(basic.random(max, min), basic.random(max, min))
}

function square(max = 5, min = 1) {
  const size = basic.random(max, min);
  return matrix.random(size, size);
}

describe('matrix', function () {
  it('create', function () {
    const A = random();
    const [x, y] = matrix.size(A);
    const B = matrix.create(x, y, (i, j) => A[i][j]);
    assertFinite({A, B});
    assert(matrix.equals(A, B));
  });

  it('transpose', function () {
    const A = random();
    const B = matrix.transpose(A);
    assertFinite({A, B});
    assert(matrix.every(A, (a, i, j) => a === B[j][i]));
  });

  it('identity', function () {
    const A = matrix.identity(basic.random(10, 1));
    assertFinite({A});
    assert(matrix.every(A, (a, i, j) => a === (i === j ? 1 : 0)));
  });

  it('multiply', function () {
    const A = random();
    const B = matrix.random(...matrix.size(A).reverse());
    const C = matrix.multiply(A, B);
    assertFinite({A, B, C});
    assert(C.length === A.length);
    assert(C[0].length === B.length);
    const every = (A, B, C) => matrix.every(A, (a, i, j) => a * B[j][i] === C[i][j]);
    assert(every(A, B, C));
    const D = matrix.multiply(B, A);
    assertFinite({D});
    assert(every(B, A, D));
  });

  it('inverse', function () {
    const A = square();
    const I = matrix.identity(A.length);
    assert(I.length === A.length);
    const B = matrix.multiply(A, I);
    assert(B.length === A.length);
    const C = matrix.multiply(I, A);
    assert(C.length === A.length);
    assertFinite({A, I, B, C});
    // print({A, I, B, C});
    assert(matrix.equals(C, B))
  });
});
