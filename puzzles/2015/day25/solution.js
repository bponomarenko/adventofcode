export const formatInput = input => input;

export const part1 = () => {
  let num = 20151125;
  let maxRow = 2;
  let row = 1;
  let col = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    num = (num * 252533) % 33554393;
    if (row === 1) {
      row = maxRow;
      maxRow += 1;
      col = 1;
    } else {
      row -= 1;
      col += 1;
    }

    // Enter the code at row 2947, column 3029.
    if (row === 2947 && col === 3029) {
      return num;
    }
  }
};

// Part 2 is not there, free start and the year is done!
export const part2 = input => part1(input);
