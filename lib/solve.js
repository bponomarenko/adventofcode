const { readFile } = require('fs/promises');
const readline = require('readline');
const chalk = require('chalk');
const { submitAnswer } = require('./client');
const { getInputPath, getSolutionPath, getElapsedTime } = require('./utils');
const validate = require('./validate');

const submitQuestion = () => new Promise((resolve, reject) => {
  try {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
    rl.question(chalk`\n{bold Submit?} {gray (yes/{bold No})} `, answer => {
      resolve(answer === 'yes');
      rl.close();
    });
  } catch (error) {
    reject(error);
  }
});

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

const solve = async (year, day, part, submit, toValidate) => {
  if (toValidate) {
    const isValid = await validate(year, day, part);
    if (!isValid) {
      return;
    }
  }

  const start = process.hrtime();
  const answer = await getAnswer(year, day, part);
  console.log(chalk`Puzzle answer is: {bold ${answer}} {dim (in ${getElapsedTime(start)})}`);
  if (!answer) {
    return;
  }

  const doSubmit = process.env.STATIC ? await submitQuestion() : submit;
  if (doSubmit && answer) {
    await submitAnswer(year, day, part, answer);
    console.log(chalk.green('...and it is correct!'));
  }
};

module.exports = solve;

module.exports.getAnswer = getAnswer;
