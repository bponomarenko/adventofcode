export const formatInput = input => input.split('\n').map(line => line.split(''));

const pairs = new Map([['{', '}'], ['(', ')'], ['<', '>'], ['[', ']']]);

const parseNavSubsystem = input => input.map(line => {
  const expectedTags = [];

  for (let i = 0; i < line.length; i += 1) {
    const tag = line[i];
    if (pairs.has(tag)) {
      // this is open tag for a new chunk
      expectedTags.push(pairs.get(tag));
    } else {
      const expectedTag = expectedTags.pop();
      if (tag !== expectedTag) {
        // This is corrupted chunk
        return { corrupted: true, tag };
      }
    }
  }
  // If there are any expected tags – line is incomplete
  return expectedTags.length ? expectedTags.reverse() : null;
});

export const part1 = input => parseNavSubsystem(input).reduce((score, line) => {
  if (line?.corrupted) {
    // Get the score of the corrupted lines only
    switch (line.tag) {
      case ')':
        return score + 3;
      case ']':
        return score + 57;
      case '}':
        return score + 1197;
      case '>':
        return score + 25137;
    }
  }
  return score;
}, 0);

export const part2 = input => {
  const lineScores = parseNavSubsystem(input)
    .filter(line => line && !line.corrupted)
    // Get the score of the incomplete lines only
    .map(line => line.reduce((acc, tag) => {
      acc *= 5;
      switch (tag) {
        case ')':
          return acc + 1;
        case ']':
          return acc + 2;
        case '}':
          return acc + 3;
        case '>':
          return acc + 4;
      }
      return acc;
    }, 0))
    .sort((a, b) => a - b);
  return lineScores[Math.floor(lineScores.length / 2)];
};
