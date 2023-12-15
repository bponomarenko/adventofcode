export const formatInput = input => input.split('\n').map(line => {
  const [a, b] = line.split('/');
  return [+a, +b];
});

const findStrongestBridge = (bridge, parts, checkLength) => {
  let max = [0, 0]; // [length, strength]
  for (let i = 0; i < parts.length; i += 1) {
    const [a, b] = parts[i];
    let newPart;
    if (a === bridge[0][0]) {
      newPart = [b, a];
    } else if (b === bridge[0][0]) {
      newPart = [a, b];
    }

    if (newPart) {
      const remainingParts = [...parts];
      remainingParts.splice(i, 1);
      const newMax = findStrongestBridge([newPart, ...bridge], remainingParts);
      if ((checkLength ? newMax[0] >= max[0] : true) && newMax[1] > max[1]) {
        max = newMax;
      }
    }
  }
  return max[1] ? max : [bridge.length - 1, bridge.flat().sum()];
};

export const part1 = input => findStrongestBridge([[0, 0]], input)[1];

export const part2 = input => findStrongestBridge([[0, 0]], input, true)[1];
