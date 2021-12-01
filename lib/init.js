const { stat, mkdir, writeFile } = require('fs/promises');
const chalk = require('chalk');
const execa = require('execa');
const { getInput } = require('./client');
const { getPuzzlePath, getSolutionPath, getInputPath } = require('./utils');

const solutionTemplate1 = `
const formatInput = input => input;

const main = input => {
  console.log(input);
  return null;
};

module.exports = {
  main: (input, isTest) => main(formatInput(input), isTest),
  formatInput,
};
`.slice(1);

const solutionTemplate2 = `
const { formatInput } = require('./part1');

const main = input => {
  console.log(input);
  return null;
};

module.exports = { main: (input, isTest) => main(formatInput(input), isTest) };
`.slice(1);

const hasFile = async path => {
  try {
    const stats = await stat(path);
    return !!stats;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
};

const init = async (year, day) => {
  let input;
  try {
    // Try to load puzzle input first
    const res = await getInput(year, day);
    input = res.data;
  } catch (error) {
    if (error.response.status === 404) {
      throw new Error('Puzzle is not available yet');
    }
    throw error;
  }

  // Create puzzle folders
  await mkdir(getPuzzlePath(year, day), { recursive: true });

  // Create file with input
  await writeFile(getInputPath(year, day), input);
  if (!(await hasFile(getSolutionPath(year, day, 1)))) {
    await writeFile(getSolutionPath(year, day, 1), solutionTemplate1);
  }
  if (!(await hasFile(getSolutionPath(year, day, 2)))) {
    await writeFile(getSolutionPath(year, day, 2), solutionTemplate2);
  }

  console.log(chalk.green('Puzzle successfully initialized'));

  // Open solution files in the vscode
  execa('code', ['-r', getSolutionPath(year, day, 1), getSolutionPath(year, day, 2), getInputPath(year, day)]);
};

module.exports = init;
