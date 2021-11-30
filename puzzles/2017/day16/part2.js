const { formatInput, doMove } = require('./part1');

const main = input => {
  const movesCount = input.moves.length;
  let programs = Array.from(input.programs);
  let counter = 1_000;
  do {
    for (let i = 0; i < movesCount; i += 1) {
      programs = doMove(programs, input.moves[i]);
    }
    counter -= 1;
  } while (counter > 0);
  return programs.join('');
};

module.exports = { main: input => main(formatInput(input)) };
