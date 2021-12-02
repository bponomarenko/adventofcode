const readline = require('readline');
const { hrtime } = require('process');

const getPuzzlePath = (year, day) => `puzzles/${year}/day${day > 9 ? '' : '0'}${day}`;

const getSolutionPath = (year, day) => `${getPuzzlePath(year, day)}/solution.js`;

const getTestCasesPath = (year, day) => `${getPuzzlePath(year, day)}/test-cases.json`;

const getInputPath = (year, day) => `${getPuzzlePath(year, day)}/input.txt`;

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

module.exports = {
  getPuzzlePath,
  getSolutionPath,
  getTestCasesPath,
  getInputPath,
  readInput,
  getElapsedTime,
  execSolution,
};
