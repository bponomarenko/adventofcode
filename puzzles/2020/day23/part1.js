const formatInput = input => input.split('').map(cup => +cup);

const main = input => {
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

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
};
