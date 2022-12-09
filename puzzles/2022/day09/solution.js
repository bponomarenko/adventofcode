export const formatInput = input => input.split('\n').map(line => {
  const [cmd, size] = line.split(' ');
  switch (cmd) {
    case 'R':
      return [(x, y) => [x + 1, y], +size];
    case 'L':
      return [(x, y) => [x - 1, y], +size];
    case 'U':
      return [(x, y) => [x, y - 1], +size];
    case 'D':
      return [(x, y) => [x, y + 1], +size];
  }
  return null;
});

const getDx = (k1, k2) => k1[0] - k2[0];
const getDy = (k1, k2) => k1[1] - k2[1];
const isTooFar = value => Math.abs(value) > 1;
const haveToMove = (k1, k2) => isTooFar(getDx(k1, k2)) || isTooFar(getDy(k1, k2));

const countRopeTailPositions = (moves, ropeLength) => {
  const rope = new Array(ropeLength).fill(0).map(() => [0, 0]);
  const lastKnotIndex = ropeLength - 1;
  const visited = new Set([rope[lastKnotIndex].join(',')]);

  moves.forEach(([cmd, count]) => {
    for (let i = 0; i < count; i += 1) {
      // move the head
      rope[0] = cmd(...rope[0]);

      // move the rest of the rope
      for (let k = 1; k < ropeLength; k += 1) {
        const knot = rope[k];
        const prevKnot = rope[k - 1];

        const dx = getDx(knot, prevKnot);
        let newX = null;
        if (isTooFar(dx)) {
          newX = dx > 0 ? knot[0] - 1 : knot[0] + 1;
        }

        const dy = getDy(knot, prevKnot);
        let newY = null;
        if (isTooFar(dy)) {
          newY = dy > 0 ? knot[1] - 1 : knot[1] + 1;
        }

        let moved = false;
        if (newX !== null || newY !== null) {
          rope[k] = [newX !== null ? newX : prevKnot[0], newY !== null ? newY : prevKnot[1]];
          // Tail of the rope always have to re-position.
          // Otherwise check is the next knot would have to be moved
          moved = k === lastKnotIndex || haveToMove(rope[k + 1], rope[k]);
        }

        if (!moved) {
          // if prev knots didn't move – the rest of the rope will stay at previous place
          k = ropeLength;
        }
      }
      visited.add(rope[lastKnotIndex].join(','));
    }
  });
  return visited.size;
};

export const part1 = input => countRopeTailPositions(input, 2);

export const part2 = input => countRopeTailPositions(input, 10);
