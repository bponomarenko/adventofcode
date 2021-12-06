import { createHash } from 'crypto';

export default (send, { input, start, finish }) => {
  for (let i = start; i < finish; i += 1) {
    const hash = createHash('md5').update(`${input}${i}`).digest('hex');
    if (hash.startsWith('00000')) {
      let pos = +hash[5];
      if (!Number.isNaN(pos) && pos < 8) {
        send([pos, hash[6]]);
      }
    }
  }
  send('done');
};
