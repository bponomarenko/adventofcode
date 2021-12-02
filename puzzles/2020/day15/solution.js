const formatInput = input => input.split(',').map(n => +n);

const part1 = input => {
  const spoken = Array.from(input);

  while (spoken.length < 2020) {
    const lastNum = spoken[spoken.length - 1];
    const lastIndex = spoken.slice(0, -1).lastIndexOf(lastNum);
    if (lastIndex === -1) {
      spoken.push(0);
    } else {
      spoken.push(spoken.length - lastIndex - 1);
    }
  }
  return spoken.pop();
};

const part2 = input => {
  const indices = new Map();
  let lastNum;
  let turn;

  input.forEach((n, i) => {
    lastNum = n;
    turn = i;
    indices.set(lastNum, [-1, turn]);
  });

  while (turn < 30_000_000 - 1) {
    turn += 1;
    const [prevIndex, lastIndex] = indices.get(lastNum) || [];
    lastNum = prevIndex !== -1 ? lastIndex - prevIndex : 0;
    indices.set(lastNum, [indices.get(lastNum)?.[1] ?? -1, turn]);
  }
  return lastNum;
};

module.exports = { part1, part2, formatInput };
