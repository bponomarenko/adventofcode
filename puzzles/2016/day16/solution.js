export const formatInput = input => input;

const getChecksum = (a, length) => {
  while (a.length < length) {
    let b = a.split('1').reverse().map(v => v.replace(/0/g, '1')).join('0');
    a = `${a}0${b}`;
  }
  a = a.slice(0, length);

  let checksum = a;
  while (checksum.length % 2 === 0) {
    let hash = '';
    for (let i = 0; i < checksum.length; i += 2) {
      hash += checksum[i] ^ checksum[i + 1] ? '0' : '1';
    }
    checksum = hash;
  }
  return checksum;
};

export const part1 = input => getChecksum(input, 272);

export const part2 = input => getChecksum(input, 35651584);
