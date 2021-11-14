const { mkdir, writeFile } = require('fs/promises');
const chalk = require('chalk');
const execa = require('execa');
const { getInput } = require('./client');
const { getPuzzlePath, getSolutionPath, getInputPath } = require('./utils');

const solutionTemplate1 = `
const main = input => {
  console.log(input);
  return null;
};

module.exports = { main };
`.slice(1);

const solutionTemplate2 = `
const part1 = require('./part1');

const main = input => {
  console.log(input);
  return part1.main(input);
};

module.exports = { main };
`.slice(1);

const init = async (yearArg, dayArg) => {
  const year = yearArg || new Date().getFullYear();
  const day = dayArg || new Date().getDate();

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
  await writeFile(getSolutionPath(year, day, 1), solutionTemplate1);
  await writeFile(getSolutionPath(year, day, 2), solutionTemplate2);

  console.log(chalk.green('Puzzle successfully initialized'));

  // Open solution files in the vscode
  execa('code', ['-r', getSolutionPath(year, day, 1), getSolutionPath(year, day, 2), getInputPath(year, day)]);
};

module.exports = init;
