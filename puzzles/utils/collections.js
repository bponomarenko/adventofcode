export const slidingWindows = (arr, size) => {
  let windows = [];
  for (let i = 0; i < arr.length - size + 1; i += size - 1) {
    windows.push(arr.slice(i, i + size));
  }
  return windows;
};

export function* combinations(arr, size) {
  if (size < 2) {
    for (const value of arr) {
      yield [value];
    }
  } else {
    for (let i = 0; i < arr.length + 1 - size; i += 1) {
      const value = arr[i];
      for (const combo of combinations(arr.slice(i + 1), size - 1)) {
        yield [value, ...combo];
      }
    }
  }
}

export function* permutations(arr, size) {
  let index = 0;
  for (const value of arr) {
    if (size < 2) {
      yield [value];
    } else {
      const subArr = Array.from(arr);
      subArr.splice(index, 1);
      for (const perm of permutations(subArr, size - 1)) {
        yield [value, ...perm];
      }
    }
    index += 1;
  }
}

export const sum = arr => arr.reduce((total, value) => total + value, 0);
