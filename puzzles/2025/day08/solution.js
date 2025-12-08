import { getEuclideanDistance } from '../../utils/grid.js';

export const formatInput = input => input.split('\n').map(line => line.toNumArray(','));

const connectBoxes = (input, limit) => {
  const countBoxes = input.length;
  const circuits = [];
  let firstMerger;
  Array.from(input.combinations(2))
    .map(([p1, p2]) => [getEuclideanDistance(p1, p2), p1.join('-'), p2.join('-')])
    .sort(([d1], [d2]) => d1 - d2)
    .slice(0, limit)
    .forEach(([, p1, p2]) => {
      const i1 = circuits.findIndex(c => c.has(p1) || c.has(p2));

      // if no circuits found, create new
      if (i1 === -1) {
        circuits.push(new Set([p1, p2]));
        return;
      }

      // if both points are already in the same circuit, skip
      const circuit = circuits[i1];
      if (circuit.has(p1) && circuit.has(p2)) {
        return;
      }

      // otherwise, add both points to the circuit
      circuit.add(p1);
      circuit.add(p2);

      // register when all the boxes are in the same circuit
      if (circuit.size === countBoxes) {
        firstMerger = [p1, p2];
      }

      // check if points are in different circuits, and merge them if so
      const i2 = circuits.findLastIndex(c => c.has(p1) || c.has(p2));
      if (i1 === i2) {
        return;
      }
      circuits[i1] = new Set([...circuits[i1], ...circuits[i2]]);
      circuits.splice(i2, 1);
    });
  return [circuits, firstMerger];
};

export const part1 = (input, isTest) => connectBoxes(input, isTest ? 10 : 1000)[0]
  .map(c => c.size)
  .sort((s1, s2) => s2 - s1)
  .slice(0, 3)
  .mul();

export const part2 = input => connectBoxes(input)[1].map(line => line.split('-')[0]).mul();
