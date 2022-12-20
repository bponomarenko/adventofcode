export const formatInput = input => {
  const file = input.split('\n').map((value, index) => ({ index, num: +value }));
  // add obj pointers
  file.forEach((obj, i) => {
    // Add pointers
    obj.next = file[i + 1];
  });
  return file;
};

const getGrooveSum = file => {
  const size = file.length;
  const zero = file.findIndex(({ num }) => num === 0);
  const getNthIndex = (n, index) => ((n % size) + index) % size;
  return file[getNthIndex(1000, zero)].num + file[getNthIndex(2000, zero)].num + file[getNthIndex(3000, zero)].num;
};

const mixFile = file => {
  const size = file.length;
  let toMove = file.find(({ index }) => index === 0);
  do {
    if (Math.abs(toMove.num % (size - 1)) !== 0) {
      const index = file.indexOf(toMove);
      const nextIndex = (index + toMove.num) % (size - 1);
      file.splice(index, 1);
      file.splice(nextIndex, 0, toMove);
    }
    toMove = toMove.next;
  } while (toMove);
  return file;
};

export const part1 = file => getGrooveSum(mixFile(file));

export const part2 = file => {
  // "decrypt" messages
  file.forEach(obj => {
    obj.num *= 811589153;
  });

  // Mix 10 timesc
  for (let i = 0; i < 10; i += 1) {
    mixFile(file);
  }
  return getGrooveSum(file);
};
