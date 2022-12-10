export const formatInput = input => input.split('\n').map(line => {
  const [type, value] = line.split(' ');
  return [type, +value];
});

const runClockCircuit = (instructions, count, callback) => {
  let x = 1;
  let cycles = 1;

  while (cycles <= count) {
    callback(cycles, x);
    const [type, value] = instructions.shift();
    switch (type) {
      case 'addx':
        instructions.unshift(['add', value]);
        break;
      case 'add':
        x += value;
        break;
    }
    cycles += 1;
  }
};

export const part1 = input => {
  let score = 0;
  runClockCircuit(input, 220, (cycle, x) => {
    if ((cycle - 20) % 40 === 0) {
      score += x * cycle;
    }
  });
  return score;
};

export const part2 = input => {
  const width = 40;
  const height = 6;
  const crt = new Array(width * height).fill(' ');

  runClockCircuit(input, 240, (cycle, x) => {
    const i = cycle - 1;
    const s = x + Math.floor(cycle / width) * width;
    if (i >= s - 1 && i <= s + 1) {
      crt[i] = '#';
    }
  });

  // print ASCII art with result this time
  for (let y = 0; y < height; y += 1) {
    console.log(crt.slice(y * width, y * width + width).join(''));
  }
};
