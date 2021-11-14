const dx = 3;
const dy = 1;

const main = input => {
  const lines = input.split('\n');
  const repeat = lines[0].length;
  let x = dx;
  let y = dy;
  let trees = 0;

  do {
    if (lines[y][x > repeat ? x % repeat : x] === '#') {
      trees += 1;
    }

    x += dx;
    y += dy;
  } while (y < lines.length);

  return trees;
};

module.exports = { main };
