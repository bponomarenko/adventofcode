const { formatInput } = require('./part1');

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

const main = ({ player1, player2 }) => {
  const [, winner] = game(player1, player2);
  return winner.reverse().reduce((acc, card, i) => acc + (i + 1) * card, 0);
};

module.exports = { main: input => main(formatInput(input)) };
