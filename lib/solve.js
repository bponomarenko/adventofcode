import { hrtime } from 'process';
import { pathToFileURL } from 'url';
import { readFile } from 'fs/promises';
import chalk from 'chalk';
import { program } from 'commander';
import { getInputPath, execSolution, getElapsedTime } from './utils.js';
import validateSolution from './validate.js';
import { loadInvalidAnswers } from './answers.js';

const getAnswer = async (year, day, part) => {
  let input;
  try {
    input = await readFile(getInputPath(year, day), 'utf8');
  } catch (error) {
    throw new Error(`Unable to read input file: ${error.message}`);
  }
  return execSolution(year, day, part, input);
};

const solve = async (year, day, part, validate) => {
  if (validate) {
    const isValid = await validateSolution(year, day, part);
    if (!isValid) {
      return { invalid: true };
    }
  }

  const start = hrtime.bigint();
  console.log(chalk.gray.dim('\nCalculating answer...'));
  const answer = await getAnswer(year, day, part);
  console.log(chalk`Puzzle answer is: {bold ${answer}} {dim (in ${getElapsedTime(start)})}`);
  if (answer == null) {
    return { answer };
  }
  const invalidAnswers = await loadInvalidAnswers();
  if (invalidAnswers?.[year]?.[day]?.[part]?.includes(answer)) {
    console.log(chalk.yellow`(this answer was previously rejected as invalid)`);
  }
  return { answer };
};

export default solve;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Loaded direction as a script
  await program
    .argument('<year>', null, Number)
    .argument('<day>', null, Number)
    .argument('<part>', null, Number)
    .argument('[validate]', null, Boolean)
    .action(async (...args) => {
      process.send(await solve(...args));
    })
    .parseAsync();
}
