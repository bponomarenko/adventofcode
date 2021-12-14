// eslint-disable-next-line import/prefer-default-export
export const slidingWindows = (arr, size) => {
  let windows = [];
  for (let i = 0; i < arr.length - size + 1; i += size - 1) {
    windows.push(arr.slice(i, i + size));
  }
  return windows;
};
