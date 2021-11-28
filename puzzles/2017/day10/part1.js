const formatInput = input => {
  const [size, lengths] = input.split('\n');
  return { listSize: +size, lengths: lengths.split(/,\s?/).map(num => +num) };
};

const computeInRounds = (listInput, lengths, listSize, roundsCount) => {
  const list = Array.from(listInput);
  let pos = 0;
  let skipSize = 0;

  for (let i = 0; i < roundsCount; i += 1) {
    // eslint-disable-next-line no-loop-func -- Do the magic
    lengths.forEach(length => {
      // Do the selection
      const reverseValues = list.slice(pos, pos + length);
      if (reverseValues.length < length) {
        reverseValues.push(...list.slice(0, length - reverseValues.length));
      }

      // Reverse!
      reverseValues.reverse();

      // Update the list
      reverseValues.forEach((value, index) => {
        let fillPos = pos + index;
        // Make sure to wrap position
        fillPos = fillPos > listSize - 1 ? fillPos - listSize : fillPos;
        list[fillPos] = value;
      });

      pos += length + skipSize;
      // Wrap around the list if next position is out of range
      while (pos > listSize) {
        pos -= listSize;
      }
      skipSize += 1;
    });
  }
  return list;
};

const main = ({ listSize, lengths }) => {
  // Array with numbers 0 - listSize
  const list = new Array(listSize).fill(0).map((_, i) => i);
  const [first, second] = computeInRounds(list, lengths, listSize, 1);
  return first * second;
};

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
  computeInRounds,
};
