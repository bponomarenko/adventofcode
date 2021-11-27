const formatInput = input => input.split(',').map(n => +n);

const main = input => {
  const spoken = Array.from(input);

  while (spoken.length < 2020) {
    const lastNum = spoken[spoken.length - 1];
    const lastIndex = spoken.slice(0, -1).lastIndexOf(lastNum);
    if (lastIndex === -1) {
      spoken.push(0);
    } else {
      spoken.push(spoken.length - lastIndex - 1);
    }
  }
  return spoken.pop();
};

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
};
