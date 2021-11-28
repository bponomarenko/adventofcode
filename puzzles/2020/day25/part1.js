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

const main = ({ cardPK, doorPK }) => {
  const cardLS = findLoopSize(cardPK);
  return transformSN(doorPK, cardLS);
};

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
};
