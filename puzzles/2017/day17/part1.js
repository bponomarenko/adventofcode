const formatInput = input => +input;

const fillBuffer = (iterations, steps) => {
  const buffer = [0];
  let pos = 0;

  for (let i = 0; i < iterations; i += 1) {
    const bufferLength = i + 1;
    pos += steps >= bufferLength ? steps % bufferLength : steps;
    pos = (pos >= bufferLength ? pos - bufferLength : pos) + 1;
    buffer.splice(pos, 0, i + 1);
  }
  return [buffer, pos];
};

const main = input => {
  const [buffer, lastPosition] = fillBuffer(2017, input);
  return buffer[lastPosition + 1];
};

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
  fillBuffer,
};
