export const formatInput = input => input.split('\n').map(line => line.split(''));

const pairs = new Map([['{', '}'], ['(', ')'], ['<', '>'], ['[', ']']]);
const corruptedScores = new Map([[')', 3], [']', 57], ['}', 1197], ['>', 25137]]);

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
  return expectedTags.length ? expectedTags : null;
});

export const part1 = input => parseNavSubsystem(input)
  // Get the score of the corrupted lines only
  .reduce((score, line) => (line?.corrupted ? score + corruptedScores.get(line.tag) : score), 0);

const incompleteScores = new Map([[')', 1], [']', 2], ['}', 3], ['>', 4]]);

export const part2 = input => {
  const lineScores = parseNavSubsystem(input)
    .filter(line => line && !line.corrupted)
    // Get the score of the incomplete lines only
    .map(line => line.reverse().reduce((acc, tag) => acc * 5 + incompleteScores.get(tag), 0))
    .sort((a, b) => a - b);
  return lineScores[Math.floor(lineScores.length / 2)];
};
