import { getRelativeCoord } from '../../utils/grid.js';

export const formatInput = input => input.split('\n');
formatInput.doNotTrim = true;

const cartsRe = /[><^v]/g;
const directionsMap = { '<': 'l', '^': 'u', '>': 'r', v: 'd' };
const directions = Object.values(directionsMap);

const sortCarts = carts => carts.sort((c1, c2) => {
  const dy = c1.y - c2.y;
  return dy === 0 ? c1.x - c2.x : dy;
});

const parseMap = input => {
  const carts = [];
  const track = input.map((line, y) => {
    for (let match of line.matchAll(cartsRe)) {
      const cart = match[0];
      carts.push({
        y,
        x: match.index,
        direction: directionsMap[cart],
        countCrossroads: 0,
      });
      line = `${line.slice(0, match.index)}${cart === '<' || cart === '>' ? '-' : '|'}${line.slice(match.index + 1)}`;
    }
    return line;
  });
  return [track, sortCarts(carts)];
};

const turn = (direction, d) => directions[(directions.indexOf(direction) + d + 4) % 4];

const moveCart = (track, carts, cart) => {
  const nextPos = getRelativeCoord(cart.x, cart.y, cart.direction);
  let crashPos;

  // find crashes
  if (carts.some(({ x, y }) => nextPos[0] === x && nextPos[1] === y)) {
    crashPos = nextPos;
  }

  // update cart position
  [cart.x, cart.y] = nextPos;
  if (crashPos) {
    return crashPos;
  }

  // update cart direction
  switch (track[nextPos[1]][nextPos[0]]) {
    case '+':
      if (cart.countCrossroads % 3 === 0) {
        // turn left
        cart.direction = turn(cart.direction, -1);
      } else if ((cart.countCrossroads + 1) % 3 === 0) {
        // turn right
        cart.direction = turn(cart.direction, 1);
      }
      cart.countCrossroads += 1;
      break;
    case '\\':
      switch (cart.direction) {
        case 'u':
          cart.direction = 'l';
          break;
        case 'l':
          cart.direction = 'u';
          break;
        case 'r':
          cart.direction = 'd';
          break;
        case 'd':
          cart.direction = 'r';
          break;
      }
      break;
    case '/':
      switch (cart.direction) {
        case 'u':
          cart.direction = 'r';
          break;
        case 'l':
          cart.direction = 'd';
          break;
        case 'r':
          cart.direction = 'u';
          break;
        case 'd':
          cart.direction = 'l';
          break;
      }
      break;
  }
  return null;
};

export const part1 = input => {
  const [track, carts] = parseMap(input);
  let crashPos;

  while (!crashPos) {
    carts.forEach(cart => {
      if (crashPos) {
        return;
      }
      crashPos = moveCart(track, carts, cart);
    });

    if (!crashPos) {
      sortCarts(carts);
    }
  }
  return crashPos.join(',');
};

export const part2 = input => {
  let [track, carts] = parseMap(input);
  while (carts.length > 1) {
    carts.forEach(cart => {
      const crashPos = moveCart(track, carts, cart);
      if (crashPos) {
        carts = carts.filter(({ x, y }) => x !== crashPos[0] || y !== crashPos[1]);
      }
    });
  }
  return `${carts[0].x},${carts[0].y}`;
};
