const { readFile, writeFile } = require('fs/promises');
const readline = require('readline');
const { hrtime } = require('process');

const getYearPath = year => `puzzles/${year}`;
const getPuzzlePath = (year, day) => `${getYearPath(year)}/day${String(day).padStart(2, '0')}`;
const getSolutionPath = (year, day) => `${getPuzzlePath(year, day)}/solution.js`;
const getTestCasesPath = (year, day) => `${getPuzzlePath(year, day)}/test-cases.json`;
const getInputPath = (year, day) => `${getPuzzlePath(year, day)}/input.txt`;

let invalidAnswers;

const readInput = async () => new Promise(resolve => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const lines = [];
  rl.write('Enter test input data:\n');
  rl.prompt();
  rl.on('line', line => {
    if (line.trim()) {
      lines.push(line.trim());
    } else {
      rl.close();
    }
  });
  rl.on('close', () => resolve(lines.join('\n')));
});

const execSolution = (year, day, part, input, isTest) => {
  const { part1, part2, formatInput } = require(`../${getSolutionPath(year, day)}`);
  const main = part === 1 ? part1 : part2;
  return main(formatInput(input.trim()), isTest);
};

const getElapsedTime = start => {
  const elapsed = hrtime.bigint() - start;
  const seconds = Number(elapsed / 1_000_000_000n) + (Number(elapsed / 1_000_000n) / 1000); // divide by a million to get nano to milli
  return `${seconds.toFixed(3)}s`;
};

const loadInvalidAnswers = async () => {
  if (invalidAnswers) {
    return invalidAnswers;
  }
  try {
    invalidAnswers = JSON.parse(await readFile('invalid-answers.json', 'utf8'));
    return invalidAnswers;
  } catch (error) {
    if (error.code === 'ENOENT') {
      invalidAnswers = {};
      return invalidAnswers;
    }
    throw error;
  }
};

const saveInvalidAnswer = async (year, day, part, answer) => {
  if (invalidAnswers) {
    invalidAnswers = {};
  }
  if (!invalidAnswers[year]) {
    invalidAnswers[year] = {};
  }
  if (!invalidAnswers[year][day]) {
    invalidAnswers[year][day] = {};
  }
  if (!invalidAnswers[year][day][part]) {
    invalidAnswers[year][day][part] = [];
  }
  if (!invalidAnswers[year][day][part].includes(answer)) {
    invalidAnswers[year][day][part].push(answer);
    await writeFile('invalid-answers.json', JSON.stringify(invalidAnswers, null, 4));
  }
};

module.exports = {
  getYearPath,
  getPuzzlePath,
  getSolutionPath,
  getTestCasesPath,
  getInputPath,
  readInput,
  getElapsedTime,
  execSolution,
  loadInvalidAnswers,
  saveInvalidAnswer,
};
