const { readFile } = require('fs/promises');
const chalk = require('chalk');
const { submitAnswer } = require('./client');
const { getInputPath, getSolutionPath } = require('./utils');

const getAnswer = async (year, day, part) => {
  let input;
  try {
    input = await readFile(getInputPath(year, day), 'utf8');
  } catch (error) {
    throw new Error(`Unable to read input file: ${error.message}`);
  }

  const { main } = require(`../${getSolutionPath(year, day, part)}`);
  return main(input.trim());
};

const solve = async (year, day, part, submit) => {
  const answer = await getAnswer(year, day, part);
  console.log(chalk`Puzzle answer is: {bold ${answer}}`);

  if (submit) {
    await submitAnswer(year, day, part, answer);
    console.log(chalk.green('...and it is correct!'));
  }
};

module.exports = solve;

module.exports.getAnswer = getAnswer;
