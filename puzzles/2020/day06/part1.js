const main = input => {
  const groupAnswers = new Set();
  let totalCount = 0;

  input.split('\n').forEach(line => {
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

module.exports = { main };
