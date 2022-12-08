export const formatInput = input => +input;

export const part1 = input => {
  const buffer = [0];
  let pos = 0;

  for (let i = 0; i < 2017; i += 1) {
    const bufferLength = i + 1;
    pos += input >= bufferLength ? input % bufferLength : input;
    pos = (pos >= bufferLength ? pos - bufferLength : pos) + 1;
    buffer.splice(pos, 0, i + 1);
  }
  return buffer[pos + 1];
};

export const part2 = input => {
  let firstPosValue;
  let pos = 0;

  for (let i = 0; i < 50000000; i += 1) {
    const bufferLength = i + 1;
    pos += input >= bufferLength ? input % bufferLength : input;
    pos = (pos >= bufferLength ? pos - bufferLength : pos) + 1;
    if (pos === 1) {
      firstPosValue = i + 1;
    }
  }
  return firstPosValue;
};
