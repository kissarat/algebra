function simplify(...args) {
  const tokens = [];
  for (const token of args) {
    if (token) {
      if (token instanceof Array) {
        if (token.length > 1) {
          tokens.push(simplify(...token));
        }
        else if (token.length === 1) {
          tokens.push(...simplify(token[0]));
        }
      }
      else if ('function' === typeof token) {
        tokens.push(...simplify(...token()))
      }
      else {
        tokens.push(token)
      }
    }
  }
  return tokens;
}

function address(name, ...args) {
  return () => [name, ...args.map(arg => '[' + arg + ']')]
}

function invoke(name, ...args) {
  return () => [name, '(', args.join(','), ')']
}

function expression(...args) {
  return () => [...args]
}

function ternary(condition, yes, no) {
  return [condition, '?', yes, ':', no];
}

function generate(...args) {
  const strings = [];
  for (const token of simplify(...args)) {
    strings.push(token instanceof Array ? '(' + generate(...token) + ')' : token.toString())
  }
  return strings.join('');
}

function declare(args, ...body) {
  const a = args.join(',');
  const b = generate(...body);
  return eval(`(${a}) => ${b}`);
}

module.exports = {
  simplify,
  address,
  invoke,
  expression,
  generate,
  declare
};
