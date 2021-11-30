const formatInput = input => {
  const [str, moves] = input.split('\n');
  return {
    programs: str.split(''),
    moves: moves.split(',').map(move => {
      const instruction = move.slice(1);
      let a;
      let b;

      switch (move[0]) {
        case 's':
          return { type: 'spin', size: +instruction };
        case 'x':
          [a, b] = instruction.split('/');
          return { type: 'exchange', a: +a, b: +b };
        case 'p':
          [a, b] = instruction.split('/');
          return { type: 'partner', a, b };
        default:
          return move;
      }
    }),
  };
};

const doMove = (programs, move) => {
  let aIndex;
  let bIndex;
  switch (move.type) {
    case 'spin':
      return programs.slice(-move.size).concat(programs.slice(0, programs.length - move.size));
    case 'exchange':
      [programs[move.b], programs[move.a]] = [programs[move.a], programs[move.b]];
      return programs;
    case 'partner':
      aIndex = programs.indexOf(move.a);
      bIndex = programs.indexOf(move.b);
      [programs[bIndex], programs[aIndex]] = [programs[aIndex], programs[bIndex]];
      return programs;
    default:
      return programs;
  }
};

const main = input => {
  let { programs } = input;
  input.moves.forEach(move => {
    programs = doMove(programs, move);
  });
  return programs.join('');
};

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
  doMove,
};
