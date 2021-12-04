export const formatInput = input => input.split('\n');

export const part1 = input => {
  const groupAnswers = new Set();
  let totalCount = 0;

  input.forEach(line => {
    if (!line.trim()) {
      // line separator
      totalCount += groupAnswers.size;
      groupAnswers.clear();
      return;
    }
    line.split('').forEach(answer => groupAnswers.add(answer));
  });
  return totalCount + groupAnswers.size;
};

const getSize = answers => [...answers.values()].filter(Boolean).length;

export const part2 = input => {
  const groupAnswers = new Map();
  let totalCount = 0;

  input.forEach(line => {
    if (!line.trim()) {
      // line separator
      totalCount += getSize(groupAnswers);
      groupAnswers.clear();
      return;
    }

    if (groupAnswers.size) {
      // For the next person find similar answers
      groupAnswers.forEach((_, char) => {
        if (!line.includes(char)) {
          groupAnswers.set(char, false);
        }
      });
    } else {
      // For the first person, just fill inn all the answers
      line.split('').forEach(answer => groupAnswers.set(answer, true));
    }
  });
  return totalCount + getSize(groupAnswers);
};
