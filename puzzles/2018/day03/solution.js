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

const isIntersecting = ([, l1, t1, w1, h1], [, l2, t2, w2, h2]) => l1 + w1 > l2 && t1 + h1 > t2 && l2 + w2 > l1 && t2 + h2 > t1;

export const part2 = input => input.find(claim1 => input.every(claim2 => claim1 === claim2 || !isIntersecting(claim1, claim2)))?.[0];
