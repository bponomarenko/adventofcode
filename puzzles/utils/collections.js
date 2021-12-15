export const slidingWindows = (arr, size) => {
  let windows = [];
  for (let i = 0; i < arr.length - size + 1; i += size - 1) {
    windows.push(arr.slice(i, i + size));
  }
  return windows;
};

export const combinations = (arr, size) => {
  if (size < 2) {
    return arr.map(value => [value]);
  }
  return arr.slice(0, 1 - size)
    .flatMap((value, index) => combinations(arr.slice(index + 1), size - 1).map(combo => [value, ...combo]));
};
