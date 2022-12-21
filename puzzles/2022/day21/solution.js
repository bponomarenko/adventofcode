/* eslint-disable no-eval */
export const formatInput = input => Object.fromEntries(input.split('\n').map(line => line.split(': ')));

const doMonkeyMath = (monkeys, monkey) => {
  const param = monkeys[monkey];
  if (!Number.isNaN(+param)) {
    return +param;
  }
  const [m1, op, m2] = param.split(' ');
  return eval(`(${doMonkeyMath(monkeys, m1)} ${op} ${doMonkeyMath(monkeys, m2)})`);
};

export const part1 = monkeys => doMonkeyMath(monkeys, 'root');

export const part2 = monkeys => {
  // patch "human" monkey
  monkeys.humn = 'x';
  let monkey = monkeys.root;
  let res = null;

  do {
    const [m1, op, m2] = monkey.split(' ');
    let xOnLeft = false;
    let value;
    try {
      value = doMonkeyMath(monkeys, m1);
    } catch {
      xOnLeft = true;
      value = doMonkeyMath(monkeys, m2);
    }

    if (res === null) {
      res = value;
    } else {
      // Do reverse monkeys math
      switch (op) {
        case '+':
          res -= value;
          break;
        case '-':
          res = xOnLeft ? res + value : value - res;
          break;
        case '*':
          res /= value;
          break;
        case '/':
          res = xOnLeft ? res * value : value / res;
          break;
      }
    }
    monkey = monkeys[xOnLeft ? m1 : m2];
  } while (monkey !== 'x');
  return res;
};
