import readline from 'readline';
import { hrtime } from 'process';
import chalk from 'chalk';
import './prototype-extensions.js';

export const getYearPath = year => `puzzles/${year}`;
export const getPuzzlePath = (year, day) => `${getYearPath(year)}/day${String(day).padStart(2, '0')}`;
export const getSolutionPath = (year, day) => `${getPuzzlePath(year, day)}/solution.js`;
export const getTestCasesPath = (year, day) => `${getPuzzlePath(year, day)}/test-cases.json`;
export const getInputPath = (year, day) => `${getPuzzlePath(year, day)}/input.txt`;

export const readInput = async () => new Promise(resolve => {
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

export const execSolution = async (year, day, part, input, isTest) => {
  const { part1, part2, formatInput } = await import(`../${getSolutionPath(year, day)}`);
  const main = part === 1 ? part1 : part2;
  return main(formatInput(formatInput.doNotTrim ? input : input.trim()), isTest);
};

export const getElapsedTime = start => {
  const elapsed = hrtime.bigint() - start;
  const seconds = Number(elapsed / 1_000_000_000n) + (Number(elapsed / 1_000_000n) / 1000); // divide by a million to get nano to milli
  return `${seconds.toFixed(3)}s`;
};

export class ManagedError extends Error {
  constructor(message, originalError) {
    super(message, { cause: originalError });
  }
}

export const logError = error => {
  console.log(chalk.red(`${chalk.inverse('Error')} ${error.message}`));
  if (!(error instanceof ManagedError)) {
    // Also show error body
    console.log(error);
  }
};
