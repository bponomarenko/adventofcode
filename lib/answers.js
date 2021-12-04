const { readFile, writeFile } = require('fs/promises');
const chalk = require('chalk');
const client = require('./client');

let invalidAnswers;

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

const submitAnswer = async (answer, year, day, part) => {
  try {
    console.log(chalk.gray.dim('Submitting the answer...'));
    const { alreadySolved } = await client.submitAnswer(year, day, part, answer);
    if (alreadySolved) {
      console.log(chalk.green.dim('Correct answer... but it seems you know it before 😂'));
    } else {
      console.log(chalk.green('That is correct answer ✅'));
    }
  } catch (error) {
    await saveInvalidAnswer(year, day, part, answer);
    throw error;
  }
};

module.exports = {
  loadInvalidAnswers,
  saveInvalidAnswer,
  submitAnswer,
};
