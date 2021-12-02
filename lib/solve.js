const { readFile, writeFile } = require('fs/promises');
const readline = require('readline');
const { hrtime } = require('process');
const chalk = require('chalk');
const { submitAnswer } = require('./client');
const { getInputPath, getElapsedTime, execSolution } = require('./utils');
const validate = require('./validate');

const submitQuestion = () => new Promise((resolve, reject) => {
  try {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
    rl.question(chalk`\n{bold Submit?} {gray (no/{bold Yes})} `, answer => {
      resolve(answer === 'yes' || answer === '');
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
  return execSolution(year, day, part, input);
};

const loadInvalidAnswers = async () => {
  try {
    return JSON.parse(await readFile('invalid-answers.json', 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
};

const saveInvalidAnswer = async (year, day, part, invalidAnswers, answer) => {
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

const solve = async (year, day, part, submit, toValidate) => {
  if (toValidate) {
    const isValid = await validate(year, day, part);
    if (!isValid) {
      return { invalid: true };
    }
  }

  const start = hrtime.bigint();
  console.log(chalk.gray.dim('\nCalculating answer...'));
  const answer = await getAnswer(year, day, part);
  console.log(chalk`Puzzle answer is: {bold ${answer}} {dim (in ${getElapsedTime(start)})}`);
  if (answer == null) {
    return { noAnswer: true };
  }
  const invalidAnswers = await loadInvalidAnswers();
  if (invalidAnswers?.[year]?.[day]?.[part]?.includes(answer)) {
    console.log(chalk.yellow`(this answer was previously rejected as invalid)`);
  }

  if (submit && await submitQuestion()) {
    try {
      await submitAnswer(year, day, part, answer);
      console.log(chalk.green('...and it is correct!'));
      return { success: true };
    } catch (error) {
      await saveInvalidAnswer(year, day, part, invalidAnswers, answer);
      throw error;
    }
  }
  return null;
};

module.exports = solve;

module.exports.getAnswer = getAnswer;
