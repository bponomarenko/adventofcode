const formatInput = input => input.split('\n');

const directionRe = /se|sw|nw|ne|e|w/g;

const main = input => {
  const tiles = new Map([]);

  input.forEach(direction => {
    const matches = direction.matchAll(directionRe);
    let pos = [0, 0, 0];

    // eslint-disable-next-line no-restricted-syntax
    for (const match of matches) {
      switch (match[0]) {
        case 'se':
          pos = [pos[0], pos[1] - 1, pos[2] + 1];
          break;
        case 'sw':
          pos = [pos[0] - 1, pos[1], pos[2] + 1];
          break;
        case 'nw':
          pos = [pos[0], pos[1] + 1, pos[2] - 1];
          break;
        case 'ne':
          pos = [pos[0] + 1, pos[1], pos[2] - 1];
          break;
        case 'e':
          pos = [pos[0] + 1, pos[1] - 1, pos[2]];
          break;
        case 'w':
          pos = [pos[0] - 1, pos[1] + 1, pos[2]];
          break;
        default:
          throw new Error('not expected');
      }
    }
    tiles.set(pos.join(','), !tiles.get(pos.join(',')));
  });
  return Array.from(tiles.values()).filter(Boolean).length;
};

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
  directionRe,
};
