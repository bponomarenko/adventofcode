export const formatInput = input => input;

function* scoreboards() {
  const scoreboard = [3, 7];
  let elf1 = 0;
  let elf2 = 1;

  while (true) {
    // 1. produce new recipes
    const score = scoreboard[elf1] + scoreboard[elf2];
    if (score > 9) {
      scoreboard.push(Math.floor(score / 10));
    }
    scoreboard.push(score % 10);

    yield scoreboard;

    // 2. choose new recipe
    const count = scoreboard.length;
    elf1 = (elf1 + scoreboard[elf1] + count + 1) % count;
    elf2 = (elf2 + scoreboard[elf2] + count + 1) % count;
  }
}

export const part1 = input => {
  const maxLenth = +input + 10;
  const scoreboardsGen = scoreboards();
  let scoreboard;
  do {
    scoreboard = scoreboardsGen.next().value;
  } while (scoreboard.length < maxLenth);
  return scoreboard.slice(+input, maxLenth).join('');
};

export const part2 = input => {
  const searchScore = input.split('').map(Number);
  const searchLength = searchScore.length;
  const scoreboardsGen = scoreboards();
  let countRecipes = -1;

  while (countRecipes < 0) {
    const scoreboard = scoreboardsGen.next().value;
    const endIndex = scoreboard.lastIndexOf(searchScore[searchLength - 1]);
    if (endIndex >= 0 && searchScore.every((num, index) => scoreboard[endIndex + index - searchLength + 1] === num)) {
      countRecipes = endIndex - searchLength + 1;
    }
  }
  return countRecipes;
};
