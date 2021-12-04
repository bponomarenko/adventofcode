export const formatInput = input => input.split('\n');

const findCodePos = (moves, start) => {
  let pos = start;
  moves.forEach(move => {
    switch (move) {
      case 'R':
        pos = [pos[0], Math.min(pos[1] + 1, 2)];
        break;
      case 'L':
        pos = [pos[0], Math.max(pos[1] - 1, 0)];
        break;
      case 'U':
        pos = [Math.max(pos[0] - 1, 0), pos[1]];
        break;
      case 'D':
        pos = [Math.min(pos[0] + 1, 2), pos[1]];
        break;
    }
  });
  return pos;
};

export const part1 = input => {
  const keypad = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const code = [];
  let pos = [1, 1];

  input.forEach(instructions => {
    pos = findCodePos(instructions.split(''), pos);
    code.push(keypad[pos[0]][pos[1]]);
  });
  return +code.join('');
};

const findCodePos2 = (moves, start, keypad) => {
  let pos = start;
  let newPos;
  moves.forEach(move => {
    switch (move) {
      case 'R':
        newPos = [pos[0], pos[1] + 1];
        break;
      case 'L':
        newPos = [pos[0], pos[1] - 1];
        break;
      case 'U':
        newPos = [pos[0] - 1, pos[1]];
        break;
      case 'D':
        newPos = [pos[0] + 1, pos[1]];
        break;
    }

    if (keypad[newPos[0]]?.[newPos[1]]) {
      pos = newPos;
    }
  });
  return pos;
};

export const part2 = input => {
  const keypad = [
    [0, 0, 1, 0, 0],
    [0, 2, 3, 4, 0],
    [5, 6, 7, 8, 9],
    [0, 'A', 'B', 'C', 0],
    [0, 0, 'D', 0, 0],
  ];
  const code = [];
  let pos = [2, 0];

  input.forEach(instructions => {
    pos = findCodePos2(instructions.split(''), pos, keypad);
    code.push(keypad[pos[0]][pos[1]]);
  });
  return code.join('');
};
