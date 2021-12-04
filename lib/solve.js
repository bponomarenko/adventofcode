const { readFile } = require('fs/promises');
const { hrtime } = require('process');
const chalk = require('chalk');
const utils = require('./utils');
const validateSolution = require('./validate');
const { loadInvalidAnswers } = require('./answers');

const getAnswer = async (year, day, part) => {
  let input;
  try {
    input = await readFile(utils.getInputPath(year, day), 'utf8');
  } catch (error) {
    throw new Error(`Unable to read input file: ${error.message}`);
  }
  return utils.execSolution(year, day, part, input);
};

const solve = async ({ year, day, part, validate }) => {
  if (validate) {
    const isValid = await validateSolution({ year, day, part });
    if (!isValid) {
      return null;
    }
  }

  const start = hrtime.bigint();
  console.log(chalk.gray.dim('\nCalculating answer...'));
  const answer = await getAnswer(year, day, part);
  console.log(chalk`Puzzle answer is: {bold ${answer}} {dim (in ${utils.getElapsedTime(start)})}`);
  if (answer == null) {
    return { answer };
  }
  const invalidAnswers = await loadInvalidAnswers();
  if (invalidAnswers?.[year]?.[day]?.[part]?.includes(answer)) {
    console.log(chalk.yellow`(this answer was previously rejected as invalid)`);
  }
  return { answer };
};

module.exports = solve;
