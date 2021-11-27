const formatInput = input => {
  const [p1, p2] = input.split('\n\n');
  const player1 = p1.split('\n').slice(1).map(card => +card);
  const player2 = p2.split('\n').slice(1).map(card => +card);
  return { player1, player2 };
};

const main = ({ player1, player2 }) => {
  while (player1.length && player2.length) {
    const c1 = player1.shift();
    const c2 = player2.shift();

    if (c1 === c2) {
      player1.push(c1);
      player2.push(c2);
    } else if (c1 > c2) {
      player1.push(c1, c2);
    } else {
      player2.push(c2, c1);
    }
  }

  const winner = player1.length ? player1 : player2;
  return winner.reverse().reduce((acc, card, i) => acc + (i + 1) * card, 0);
};

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
};
