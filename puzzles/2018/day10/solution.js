const lineRegex = /^position=<(.*),(.*)> velocity=<(.*),(.*)>$/;

export const formatInput = input => input.split('\n').map(line => {
  const [, x, y, xv, yv] = line.match(lineRegex);
  return [+x.trim(), +y.trim(), +xv.trim(), +yv.trim()];
});

const getWindow = points => {
  let window = [
    -Infinity, // maxX
    Infinity, // minX
    -Infinity, // maxY
    Infinity, // minY
  ];
  points.forEach(([x, y]) => {
    window = [
      Math.max(window[0], x),
      Math.min(window[1], x),
      Math.max(window[2], y),
      Math.min(window[3], y),
    ];
  });
  return window;
};

const isWindowDecreasing = (window1, window2) => window1.every((value, i) => (i % 2 === 0 ? value > window2[i] : value < window2[i]));

const runTicks = input => {
  let prevWindow = getWindow(input);
  let countTicks = 0;

  const tick = (points, resolve) => {
    const nextPoints = points.map(([x, y, xv, yv]) => [x + xv, y + yv, xv, yv]);
    const window = getWindow(nextPoints);

    // while coordinate "window" is getting smaller – points are coming together
    // final result is when all of them in the "smallest window"
    if (isWindowDecreasing(prevWindow, window)) {
      // register next tick
      prevWindow = window;
      countTicks += 1;
      setTimeout(() => tick(nextPoints, resolve));
    } else {
      resolve([points, prevWindow, countTicks]);
    }
  };

  return new Promise(resolve => {
    tick(input, resolve);
  });
};

const print = (points, [maxX, minX, maxY, minY]) => {
  const pointsSet = new Set(points.map(([x, y]) => `${x},${y}`));
  for (let y = minY, my = maxY; y <= my; y += 1) {
    let line = '';
    for (let x = minX, mx = maxX; x <= mx; x += 1) {
      line += pointsSet.has(`${x},${y}`) ? '#' : ' ';
    }
    console.log(line, '\n');
  }
};

export const part1 = async input => {
  const [points, window] = await runTicks(input);
  // Print ASCII art with the answer on the screen this time!
  print(points, window);
};

export const part2 = async input => {
  const [, , count] = await runTicks(input);
  return count;
};
