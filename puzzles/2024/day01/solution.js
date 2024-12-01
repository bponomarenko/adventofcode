export const formatInput = input => {
  const tuples = input.split('\n').map(line => line.split('  ').map(Number));
  return [tuples.map(([num]) => num).toSorted(), tuples.map(([, num]) => num).toSorted()];
};

export const part1 = ([list1, list2]) => list1.map((num, index) => Math.abs(num - list2[index])).sum();

export const part2 = ([list1, list2]) => {
  const hashMap = new Map();
  list2.forEach(num => {
    hashMap.set(num, (hashMap.get(num) ?? 0) + 1);
  });
  return list1.sum(num => num * (hashMap.get(num) ?? 0));
};
