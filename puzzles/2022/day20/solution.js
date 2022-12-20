export const formatInput = input => {
  const file = input.split('\n').map((value, index) => ({ index, num: +value }));
  // add obj pointers, so we can follow them while "mixing the file"
  file.forEach((obj, i) => {
    obj.next = file[i + 1];
  });
  return file;
};

const getGrooveSum = file => {
  const zero = file.findIndex(({ num }) => num === 0);
  const getNthIndex = n => file[((n % file.length) + zero) % file.length].num;
  return getNthIndex(1000) + getNthIndex(2000) + getNthIndex(3000);
};

const mixFile = file => {
  const lastIndex = file.length - 1;
  let toMove = file.find(({ index }) => index === 0);
  do {
    if (Math.abs(toMove.num % lastIndex) !== 0) {
      const index = file.indexOf(toMove);
      const nextIndex = (index + toMove.num) % lastIndex;
      file.splice(nextIndex, 0, file.splice(index, 1)[0]);
    }
    toMove = toMove.next;
  } while (toMove);
  return file;
};

export const part1 = file => getGrooveSum(mixFile(file));

export const part2 = file => {
  // "decrypt" the file
  file.forEach(obj => {
    obj.num *= 811589153;
  });

  // Mix 10 times
  for (let i = 0; i < 10; i += 1) {
    mixFile(file);
  }
  return getGrooveSum(file);
};
