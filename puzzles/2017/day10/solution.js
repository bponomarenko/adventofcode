export const formatInput = input => input.split('\n');

const computeInRounds = (listInput, lengths, listSize, roundsCount) => {
  const list = Array.from(listInput);
  let pos = 0;
  let skipSize = 0;

  for (let i = 0; i < roundsCount; i += 1) {
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

export const part1 = ([size, lengths]) => {
  const listSize = +size;
  // Array with numbers 0 - listSize
  const list = Array.from(new Array(listSize), (_, i) => i);
  const [first, second] = computeInRounds(list, lengths.split(/,\s?/).map(num => +num), listSize, 1);
  return first * second;
};

const stringToHexArray = str => str.split('').map(char => char.charCodeAt(0));

const xor = values => {
  let res = values[0];
  for (let i = 1; i < values.length; i += 1) {
    res ^= values[i];
  }
  return res;
};

const pad = (value, count) => (value.length > count ? value : `${new Array(count - value.length + 1).join('0')}${value}`);

export const getKnotHash = input => {
  // Array with numbers 0 - 255
  const list = Array.from(new Array(256), (_, i) => i);
  const sequence = stringToHexArray(input).concat(17, 31, 73, 47, 23);
  const hash = computeInRounds(list, sequence, 256, 64);
  const denseHash = Array.from(new Array(16), (_, index) => xor(hash.slice(index * 16, (index + 1) * 16)));
  // Get final hex string
  return denseHash.map(code => pad(code.toString(16), 2)).join('');
};

export const part2 = ([, chars]) => getKnotHash(chars);
