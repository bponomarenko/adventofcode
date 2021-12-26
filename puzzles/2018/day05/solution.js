export const formatInput = input => input;

const collapse = str => {
  const arr = str.split('').map(char => char.charCodeAt(0));
  let pointer = 0;
  while (pointer < arr.length) {
    if (Math.abs(arr[pointer] - arr[pointer + 1]) === 32) {
      // remove reactions
      arr.splice(pointer, 2);
      pointer -= 1;
    } else {
      pointer += 1;
    }
  }
  return arr.length;
};

export const part1 = input => collapse(input);

export const part2 = input => {
  let bestLength = Infinity;
  for (let i = 97; i <= 122; i += 1) {
    const filteredStr = input.replace(new RegExp(`[${String.fromCharCode(i)}${String.fromCharCode(i - 32)}]`, 'g'), '');
    bestLength = Math.min(bestLength, collapse(filteredStr));
  }
  return bestLength;
};
