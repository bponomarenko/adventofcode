import { createHash } from 'crypto';

export default (send, { input, start, finish }) => {
  let hashPart = '';
  for (let i = start; i < finish; i += 1) {
    const hash = createHash('md5').update(`${input}${i}`).digest('hex');
    if (hash.startsWith('00000')) {
      hashPart += hash[5];
    }
  }
  send(hashPart);
};
