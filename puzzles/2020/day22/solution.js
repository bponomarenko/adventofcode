export const formatInput = input => {
  const [p1, p2] = input.split('\n\n');
  const player1 = p1.split('\n').slice(1).map(card => +card);
  const player2 = p2.split('\n').slice(1).map(card => +card);
  return { player1, player2 };
};

export const part1 = ({ player1, player2 }) => {
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

const game = (player1, player2) => {
  const history = new Set();

  while (player1.length && player2.length) {
    const setup = `${player1.join(',')}-${player2.join(',')}`;
    if (history.has(setup)) {
      // Prevents infinite recursion
      return [true, player1];
    }
    history.add(setup);

    const c1 = player1.shift();
    const c2 = player2.shift();
    let winner;
    let winningCards;

    if (c1 <= player1.length && c2 <= player2.length) {
      const [isP1Wins] = game(player1.slice(0, c1), player2.slice(0, c2));
      winner = isP1Wins ? player1 : player2;
      winningCards = !isP1Wins ? [c2, c1] : [c1, c2];
    } else {
      winner = c1 > c2 ? player1 : player2;
      winningCards = c1 > c2 ? [c1, c2] : [c2, c1];
    }
    winner.push(...winningCards);
  }
  const isPlayer1Wins = !!player1.length;
  return [isPlayer1Wins, isPlayer1Wins ? player1 : player2];
};

export const part2 = ({ player1, player2 }) => {
  const [, winner] = game(player1, player2);
  return winner.reverse().sum((card, i) => (i + 1) * card);
};
