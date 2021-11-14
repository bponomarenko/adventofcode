const getSize = answers => [...answers.values()].filter(Boolean).length;

const main = input => {
  const groupAnswers = new Map();
  let totalCount = 0;

  input.split('\n').forEach(line => {
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

module.exports = { main };
