const nodeRe = /\/dev\/grid\/node-x\d+-y\d+ +\d+T +(\d+)T +(\d+)T/;

export const formatInput = input => input.split('\n').slice(2).map(node => {
  const [, used, available] = nodeRe.exec(node);
  return { used: +used, available: +available };
});

export const part1 = nodes => {
  let count = 0;
  for (let i = 0; i < nodes.length - 1; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      if ((a.used > 0 && a.used <= b.available) || b.used > 0 && b.used <= a.available) {
        count += 1;
      }
    }
  }
  return count;
};

export const part2 = input => {
  console.log(part1(input));
  return null;
};
