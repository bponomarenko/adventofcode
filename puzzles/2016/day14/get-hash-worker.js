import { createHash } from 'crypto';

// Calculates range of hashes
export default (send, { input, start, end }) => {
  const hashes = [];
  for (let i = start; i < end; i += 1) {
    let hash = `${input}${i}`;
    for (let j = 0; j < 2017; j += 1) {
      hash = createHash('md5').update(hash).digest('hex');
    }
    hashes.push(hash);
  }
  send(hashes);
};
