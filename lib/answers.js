import { readFile, writeFile } from 'fs/promises';
import chalk from 'chalk';
import { submitAnswer as submitYourAnswer } from './client.js';

const fileName = 'answers.json';
let answers;

export const ensureAnswersLoaded = async () => {
  if (answers) {
    return;
  }
  try {
    answers = JSON.parse(await readFile(fileName, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Create new object if file doesn't exist
      answers = {};
      return;
    }
    throw error;
  }
};

export const hasAnswer = async (year, day, part, answer) => {
  await ensureAnswersLoaded();
  const { valid, invalid } = answers[year]?.[day]?.[part] ?? {};
  if (valid?.includes(answer)) {
    return { valid: true };
  }
  if (invalid?.includes(answer)) {
    return { valid: false };
  }
  return null;
};

const makeProp = (obj, props, leafValue = {}) => {
  const prop = props[0];
  const lastProp = props.length === 1;
  if (!obj[prop]) {
    obj[prop] = lastProp ? leafValue : {};
  }
  if (!lastProp) {
    makeProp(obj[prop], props.slice(1), leafValue);
  }
};

const saveAnswer = async (year, day, part, answer, valid = true) => {
  await ensureAnswersLoaded();
  const propName = valid ? 'valid' : 'invalid';
  makeProp(answers, [year, day, part, propName], []);

  if (!answers[year][day][part][propName].includes(answer)) {
    answers[year][day][part][propName].push(answer);
    await writeFile(fileName, JSON.stringify(answers, null, 4));
  }
};

export const submitAnswer = async (answer, year, day, part) => {
  try {
    console.log(chalk.gray.dim('Submitting the answer...'));
    const { alreadySolved } = await submitYourAnswer(year, day, part, answer);
    if (alreadySolved) {
      console.log(chalk.green.dim('Correct answer... but it seems you know it before 😂'));
    } else {
      console.log(chalk.green('That is correct answer ✅'));
    }
    await saveAnswer(year, day, part, answer);
  } catch (error) {
    console.log(error);
    await saveAnswer(year, day, part, answer, false);
    throw error;
  }
};
