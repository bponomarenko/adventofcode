import { pathToFileURL } from 'url';
import { readFile } from 'fs/promises';
import { hrtime } from 'process';
import chalk from 'chalk';
import { program } from 'commander';
import { getTestCasesPath, getElapsedTime, execSolution, logError } from './utils.js';

const tryReadFile = async (year, day) => {
  try {
    return JSON.parse(await readFile(getTestCasesPath(year, day), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const validate = async (year, day, part) => {
  const testCases = await tryReadFile(year, day);

  const promises = testCases
    .filter(testCase => testCase.part === part)
    .map(async ({ input, answer }, index) => {
      const start = hrtime.bigint();
      try {
        const actualAnswer = await execSolution(year, day, part, input, true);

        // eslint-disable-next-line eqeqeq -- we can be comparing strings to numbers here
        const valid = actualAnswer == answer;
        if (!valid) {
          console.log(chalk`Test case ${index + 1}: {red invalid} {dim (in ${getElapsedTime(start)})}\n\n\tExpected:\t{dim {green ${answer}}}\n\tActual:\t\t{dim {red ${actualAnswer}}}\n`);
        } else {
          console.log(chalk`Test case ${index + 1}: {green valid} {dim (in ${getElapsedTime(start)})}`);
        }
        return valid;
      } catch (error) {
        logError(error);
        return false;
      }
    });

  if (promises.length === 0) {
    console.log(chalk`{blue {dim There are no test cases for part ${part}}}`);
    return true;
  }
  console.log(chalk.gray.dim('Validating...'));
  const results = await Promise.allSettled(promises);
  return results.every(({ status, value }) => status === 'fulfilled' && value);
};

export default validate;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Loaded direction as a script
  await program
    .argument('<year>', null, Number)
    .argument('<day>', null, Number)
    .argument('<part>', null, Number)
    .action(validate)
    .parseAsync();
}
