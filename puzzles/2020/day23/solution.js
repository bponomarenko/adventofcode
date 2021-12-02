const formatInput = input => input.split('').map(cup => +cup);

const part1 = input => {
  let cups = input;
  for (let i = 0; i < 100; i += 1) {
    const tail = cups.slice(4);
    let destination = cups[0] - 1;

    while (!tail.includes(destination) && destination >= 0) {
      destination -= 1;
    }
    destination = destination === -1 ? Math.max(...tail) : destination;

    tail.splice(tail.indexOf(destination) + 1, 0, ...cups.slice(1, 4));
    tail.push(cups[0]);

    cups = tail;
  }
  return +[...cups.slice(cups.indexOf(1) + 1), ...cups.slice(0, cups.indexOf(1))].join('');
};

const part2 = input => {
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

module.exports = { part1, part2, formatInput };
