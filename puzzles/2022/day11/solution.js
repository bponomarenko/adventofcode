export const formatInput = input => {
  let commonDiv;
  const monkeys = input.split('\n\n').map(monkey => {
    const lines = monkey.split('\n');
    const [value1, operation, value2] = lines[2].split(' ').slice(-3);
    const arg1 = value1 === 'old' ? null : +value1;
    const arg2 = value2 === 'old' ? null : +value2;
    const divisibleBy = +lines[3].split(' ').pop();
    const passTo1 = +lines[4].split(' ').pop();
    const passTo2 = +lines[5].split(' ').pop();

    const op = (value, divide = true) => {
      const val1 = arg1 === null ? value : arg1;
      const val2 = arg2 === null ? value : arg2;
      const newValue = (operation === '*') ? val1 * val2 : val1 + val2;
      // Trick to avoid large numbers - use common denominator to divide by final number
      return divide ? Math.floor(newValue / 3) : newValue % commonDiv;
    };
    const pass = value => (value % divisibleBy === 0 ? passTo1 : passTo2);

    return {
      inspects: 0,
      divisibleBy,
      items: lines[1].split(':')[1].split(',').map(Number),
      op,
      pass,
    };
  });
  commonDiv = monkeys.reduce((div, { divisibleBy }) => divisibleBy * div, 1);
  return monkeys;
};

const playKeepAwayGame = (monkeys, rounds, divide) => {
  for (let i = 0; i < rounds; i += 1) {
    monkeys.forEach(monkey => {
      monkey.inspects += monkey.items.length;
      monkey.items.forEach(item => {
        const newItem = monkey.op(item, divide);
        monkeys[monkey.pass(newItem)].items.push(newItem);
      });
      monkey.items = [];
    });
  }
  const [one, two] = monkeys.sort((a, b) => b.inspects - a.inspects);
  return one.inspects * two.inspects;
};

export const part1 = monkeys => playKeepAwayGame(monkeys, 20);

export const part2 = monkeys => playKeepAwayGame(monkeys, 10000, false);
