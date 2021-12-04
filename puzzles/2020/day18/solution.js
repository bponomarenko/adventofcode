export const formatInput = input => input.split('\n');

const simpleExprRe = /\d+ [*+] \d+/;
const groupRe = /\(([^()]+)\)/;

const evalSimpleExpr = expr => {
  let simpleExpr = expr;
  let match = simpleExpr.match(simpleExprRe);
  while (match) {
    // eslint-disable-next-line no-eval
    simpleExpr = simpleExpr.replace(match[0], eval(match[0]));
    match = simpleExpr.match(simpleExprRe);
  }
  return +simpleExpr;
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

export const part1 = input => input.map(expr => evalExpr(expr))
  .reduce((acc, v) => acc + v, 0);

const sumExprRe = /\d+ \+ \d+/;

const evalSimpleExpr2 = expr => {
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

const evalExpr2 = expr => {
  let finalExpr = expr;
  let match = finalExpr.match(groupRe);
  while (match) {
    finalExpr = finalExpr.replace(match[0], evalSimpleExpr2(match[1]));
    match = finalExpr.match(groupRe);
  }
  return evalSimpleExpr2(finalExpr);
};

export const part2 = input => input.map(expr => evalExpr2(expr))
  .reduce((acc, v) => acc + v, 0);
