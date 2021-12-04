export const formatInput = input => input.split('\n\n').reduce((acc, block, index) => {
  if (index === 0) {
    acc.nums = block.split(',').map(Number);
  } else {
    acc.boards.push(block.split('\n').map(line => line.trim().split(/\s+/).map(Number)));
  }
  return acc;
}, { nums: [], boards: [] });

const markNumber = (board, num) => {
  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      if (board[i][j] === num) {
        board[i][j] = '*';
        return;
      }
    }
  }
};

const isWinningBoard = board => {
  for (let i = 0; i < 5; i += 1) {
    // Check if the line is full first
    if (board[i].every(num => num === '*')) {
      return true;
    }

    // Check the columns
    let allMarked = true;
    for (let j = 0; j < 5; j += 1) {
      allMarked = allMarked && board[j][i] === '*';
    }

    if (allMarked) {
      return true;
    }
  }
  return false;
};

const getBoardSum = board => board.flat().reduce((acc, num) => (num === '*' ? acc : acc + num), 0);

export const part1 = ({ nums, boards }) => {
  let winner;
  let drawNum;

  do {
    drawNum = nums.shift();
    boards.forEach(board => markNumber(board, drawNum));
    winner = boards.find(board => isWinningBoard(board));
  } while (!winner);

  return drawNum * getBoardSum(winner);
};

export const part2 = ({ nums, boards }) => {
  let winner;
  let drawNum;

  do {
    drawNum = nums.shift();
    boards.forEach(board => markNumber(board, drawNum));

    if (boards.length === 1 && isWinningBoard(boards[0])) {
      [winner] = boards;
    } else {
      boards = boards.filter(board => !isWinningBoard(board));
    }
  } while (!winner);

  return drawNum * getBoardSum(winner);
};
