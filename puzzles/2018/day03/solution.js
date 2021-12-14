const claimRe = /^#(.+) @ (.+),(.+): (.+)x(.+)$/;

export const formatInput = input => input.split('\n').map(line => {
  const [, id, left, top, width, height] = line.match(claimRe);
  return [+id, +left, +top, +width, +height];
});

export const part1 = input => {
  const claimedAreas = new Map();
  input.forEach(([, left, top, width, height]) => {
    for (let x = left; x < left + width; x += 1) {
      for (let y = top; y < top + height; y += 1) {
        let pos = `${x}-${y}`;
        claimedAreas.set(pos, (claimedAreas.get(pos) || 0) + 1);
      }
    }
  });
  return Array.from(claimedAreas.values()).filter(value => value > 1).length;
};

export const part2 = input => {
  console.log(input);
  return null;
};
