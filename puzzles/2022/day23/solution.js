export const formatInput = input => input.split('\n')
  .flatMap((row, y) => row.split('').map((tile, x) => (tile === '#' ? { pos: [x, y] } : null)))
  .filter(Boolean);

const getNewPosition = (elves, directions, [x, y]) => {
  const moveOptions = [
    !elves.has(`${x - 1},${y - 1}`) && !elves.has(`${x},${y - 1}`) && !elves.has(`${x + 1},${y - 1}`),
    !elves.has(`${x + 1},${y + 1}`) && !elves.has(`${x},${y + 1}`) && !elves.has(`${x - 1},${y + 1}`),
    !elves.has(`${x - 1},${y + 1}`) && !elves.has(`${x - 1},${y}`) && !elves.has(`${x - 1},${y - 1}`),
    !elves.has(`${x + 1},${y - 1}`) && !elves.has(`${x + 1},${y}`) && !elves.has(`${x + 1},${y + 1}`),
  ];
  if (moveOptions.every(Boolean)) {
    return null;
  }

  for (let i = 0; i < 4; i += 1) {
    switch (directions[i]) {
      case 'n':
        if (moveOptions[0]) {
          return [x, y - 1];
        }
        break;
      case 's':
        if (moveOptions[1]) {
          return [x, y + 1];
        }
        break;
      case 'w':
        if (moveOptions[2]) {
          return [x - 1, y];
        }
        break;
      case 'e':
        if (moveOptions[3]) {
          return [x + 1, y];
        }
        break;
    }
  }
  return null;
};

const countEmptyTiles = elves => {
  const xx = elves.map(({ pos: [x] }) => x);
  const yy = elves.map(({ pos: [, y] }) => y);
  return (Math.max(...xx) - Math.min(...xx) + 1) * (Math.max(...yy) - Math.min(...yy) + 1) - elves.length;
};

const similateElfMovements = (elves, limit = Infinity) => {
  const directions = ['n', 's', 'w', 'e'];
  const nextMoves = new Map();
  let moved = false;
  let count = 0;

  do {
    count += 1;
    const elfHashes = new Set(elves.map(({ pos }) => pos.join(',')));

    // pick new position
    elves.forEach(elf => {
      elf.to = getNewPosition(elfHashes, directions, elf.pos);
      if (elf.to) {
        const hash = elf.to.join(',');
        nextMoves.set(hash, (nextMoves.get(hash) || 0) + 1);
      }
    });

    moved = false;
    // move the elves
    elves.forEach(elf => {
      if (elf.to && nextMoves.get(elf.to.join(',')) <= 1) {
        elf.pos = elf.to;
        moved = true;
      }
      elf.to = null;
    });
    directions.push(directions.splice(0, 1)[0]);
    nextMoves.clear();
  } while (count < limit && moved);
  return count;
};

export const part1 = elves => {
  similateElfMovements(elves, 10);
  return countEmptyTiles(elves);
};

export const part2 = elves => similateElfMovements(elves);
