const { formatInput } = require('./part1');

const main = input => {
  const cups = new Map();
  const cupsArr = input;

  let first = cupsArr[0];
  let last = cupsArr[cupsArr.length - 1];

  // Add original input cups
  cupsArr.forEach((cup, i) => {
    cups.set(cup, cupsArr[i + 1] ?? null);
  });

  // Prefil cups till million
  let max = Math.max(...cupsArr) + 1;
  for (let i = cupsArr.length; i < 1_000_000; i += 1) {
    cups.set(last, max);
    cups.set(max, null);
    last = max;
    max += 1;
  }

  // Play Carb Cups!!
  for (let i = 0; i < 10_000_000; i += 1) {
    // Find next destination
    let destination = first - 1;
    while (destination === 0
      || destination === cups.get(first)
      || destination === cups.get(cups.get(first))
      || destination === cups.get(cups.get(cups.get(first)))
    ) {
      destination = destination <= 1 ? 1_000_000 : destination - 1;
    }

    // Move the first item
    cups.set(last, first);
    last = first;
    first = cups.get(first);

    // Move first 3 items
    const after = cups.get(destination);
    cups.set(destination, first);
    const lastOfThree = cups.get(cups.get(first));
    first = cups.get(lastOfThree);
    cups.set(lastOfThree, after);
  }
  return cups.get(1) * cups.get(cups.get(1));
};

module.exports = { main: input => main(formatInput(input)) };
