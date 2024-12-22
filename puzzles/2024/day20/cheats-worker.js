import { getDistance } from '../../utils/grid.js';

export default (send, { path, startIndex, cheatSize, limits }) => {
  const [x, y] = path[startIndex].split('-').map(Number);
  const [[minX, maxX], [minY, maxY]] = limits;
  let sum = 0;
  for (let dy = Math.max(minY, y - cheatSize), my = Math.min(maxY, y + cheatSize); dy <= my; dy += 1) {
    const sx = cheatSize - Math.abs(y - dy);
    for (let dx = Math.max(minX, x - sx), mx = Math.min(maxX, x + sx); dx <= mx; dx += 1) {
      if (dx === x && dy === y) {
        continue;
      }
      const index = path.indexOf(`${dx}-${dy}`);
      if (index - startIndex - getDistance([x, y], [dx, dy]) >= 100) {
        sum += 1;
      }
    }
  }
  send(sum);
};
