const { formatInput, groupRe } = require('./part1');

const sumExprRe = /\d+ \+ \d+/;

const evalSimpleExpr = expr => {
  let simpleExpr = expr;
  let match = simpleExpr.match(sumExprRe);
  while (match) {
    // eslint-disable-next-line no-eval
    simpleExpr = simpleExpr.replace(match[0], eval(match[0]));
    match = simpleExpr.match(sumExprRe);
  }
  // eslint-disable-next-line no-eval
  return eval(simpleExpr);
};

const evalExpr = expr => {
  let finalExpr = expr;
  let match = finalExpr.match(groupRe);
  while (match) {
    finalExpr = finalExpr.replace(match[0], evalSimpleExpr(match[1]));
    match = finalExpr.match(groupRe);
  }
  return evalSimpleExpr(finalExpr);
};

const main = input => input.map(expr => evalExpr(expr))
  .reduce((acc, v) => acc + v, 0);

module.exports = { main: input => main(formatInput(input)) };
