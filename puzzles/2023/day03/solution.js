import { getAdjacent } from '../../utils/grid.js';

export const formatInput = input => input.split('\n');

const partRe = /[^\d.]/;
const digitRe = /\d/;

const collectNum = (schema, x, y, part) => {
  const line = schema[y].replaceAll(part, '.');
  const startIndex = line.lastIndexOf('.', x);
  const endIndex = line.indexOf('.', x);
  const limits = [startIndex === -1 ? 0 : startIndex + 1, endIndex === -1 ? line.length : endIndex];
  return [+line.substring(limits[0], limits[1]), ...limits];
};

function* parts(schema, partType) {
  const collected = new Set();

  for (let y = 0, maxY = schema.length; y < maxY; y += 1) {
    const line = schema[y];
    for (let x = 0, maxX = line.length; x < maxX; x += 1) {
      const part = line[x];
      if (partType ? part === partType : partRe.test(part)) {
        const partNums = getAdjacent(x, y, [0, maxX - 1], [0, maxY - 1])
          .map(([ax, ay]) => {
            if (digitRe.test(schema[ay][ax]) && !collected.has(`${ax},${ay}`)) {
              const [num, minX, minY] = collectNum(schema, ax, ay, part);
              for (let dx = minX; dx < minY; dx += 1) {
                collected.add(`${dx},${ay}`);
              }
              return num;
            }
            return null;
          })
          .filter(Boolean);

        yield partNums;
      }
    }
  }
}

export const part1 = input => Array.from(parts(input)).flat().sum();

export const part2 = input => Array.from(parts(input, '*'))
  .sum(partNums => (partNums.length === 2 ? partNums.power() : 0));
