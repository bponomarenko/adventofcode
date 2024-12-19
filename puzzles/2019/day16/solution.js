export const formatInput = input => input;

const phaseSignal = signal => {
  const len = signal.length;
  let phasedSignal = '';
  for (let i = 0; i < len; i += 1) {
    let sum = 0;
    for (let p = i; p < len; p += 4 * (i + 1)) {
      for (let d = 0; d < i + 1 && p + d < len; d += 1) {
        sum += +signal[p + d];
      }
    }
    for (let p = 3 * i + 2; p < len; p += 4 * (i + 1)) {
      for (let d = 0; d < i + 1 && p + d < len; d += 1) {
        sum -= signal[p + d];
      }
    }
    phasedSignal += Math.abs(sum % 10);
  }
  return phasedSignal;
};

const applyFFT = (signal, offset = 0) => {
  let phases = 100;
  while (phases) {
    signal = phaseSignal(signal);
    phases -= 1;
  }
  return signal.slice(offset, offset + 8);
};

export const part1 = signal => applyFFT(signal);

// It should work, but of course Node.js can't handle it. Should come up with different approach to solve it
export const part2 = signal => applyFFT(
  new Array(10000).fill(signal).join(''),
  +signal.slice(0, 7),
);
