const formatInput = input => {
  const [cardPK, doorPK] = input.split('\n').map(key => +key);
  return { cardPK, doorPK };
};

const findLoopSize = publicKey => {
  const subjectNumber = 7;
  let value = 1;
  let loopSize = 0;
  while (value !== publicKey) {
    value *= subjectNumber;
    value %= 20201227;
    loopSize += 1;
  }
  return loopSize;
};

const transformSN = (subjectNumber, loopSize) => {
  let value = 1;
  let loop = 0;
  while (loop < loopSize) {
    value *= subjectNumber;
    value %= 20201227;
    loop += 1;
  }
  return value;
};

const part1 = ({ cardPK, doorPK }) => {
  const cardLS = findLoopSize(cardPK);
  return transformSN(doorPK, cardLS);
};

// There is no coding challenge for the part 2, yay :)
const part2 = input => part1(input);

module.exports = { part1, part2, formatInput };
