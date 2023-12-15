const rectRe = /^rect (\d+)x(\d+)$/;
const rotateColRe = /^rotate column x=(\d+) by (\d+)$/;
const rotateRowRe = /^rotate row y=(\d+) by (\d+)$/;

export const formatInput = input => {
  const screen = Array.from(new Array(6), () => new Array(50).fill(false));

  input.split('\n').forEach(instruction => {
    let match;
    // eslint-disable-next-line no-cond-assign
    if (match = rectRe.exec(instruction)) {
      // Rect
      for (let x = 0; x < +match[1]; x += 1) {
        for (let y = 0; y < +match[2]; y += 1) {
          screen[y][x] = true;
        }
      }
    // eslint-disable-next-line no-cond-assign
    } else if (match = rotateColRe.exec(instruction)) {
      // Rotate column
      const x = +match[1];
      const clone = screen.map(row => Array.from(row));
      const maxY = screen.length;
      for (let y = 0; y < maxY; y += 1) {
        screen[y][x] = clone[(y - match[2] + maxY) % maxY][x];
      }
    // eslint-disable-next-line no-cond-assign
    } else if (match = rotateRowRe.exec(instruction)) {
      // Rotate row
      const y = +match[1];
      const clone = Array.from(screen[y]);
      const maxX = clone.length;
      for (let x = 0; x < maxX; x += 1) {
        screen[y][x] = clone[(x - match[2] + maxX) % maxX];
      }
    }
  });
  return screen;
};

export const part1 = screen => screen.reduce((acc1, row) => acc1 + row.reduce((acc, pixel) => acc + +pixel), 0);

export const part2 = screen => {
  console.log(screen.map(row => row.map(pix => (pix ? '#' : ' ')).join('')).join('\n'), '\n');
  return 'Printed above';
};
