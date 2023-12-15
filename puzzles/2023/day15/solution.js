export const formatInput = input => input.split(',');

const getHashValue = str => str.split('').reduce((acc, char) => ((char.charCodeAt(0) + acc) * 17) % 256, 0);

export const part1 = input => input.sum(getHashValue);

export const part2 = input => {
  const hashMap = [];
  input.forEach(step => {
    const [label, focalLength] = step.split(/[-=]/);
    const box = getHashValue(label);
    if (!focalLength) {
      hashMap[box]?.delete(label);
    } else {
      if (!hashMap[box]) {
        hashMap[box] = new Map();
      }
      hashMap[box].set(label, +focalLength);
    }
  });
  return hashMap.sum((box, i) => Array.from(box.values()).sum((focalLength, j) => (i + 1) * (j + 1) * focalLength));
};
