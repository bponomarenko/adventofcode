const { stat, mkdir, writeFile } = require('fs/promises');
const chalk = require('chalk');
const execa = require('execa');
const { getInput } = require('./client');
const { getPuzzlePath, getSolutionPath, getInputPath } = require('./utils');

const solutionTemplate = `
const formatInput = input => input;

const part1 = input => {
  console.log(input);
  return null;
};

const part2 = input => {
  const result = part1(input);
  return result;
};

module.exports = { part1, part2, formatInput };
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
  if (!(await hasFile(getInputPath(year, day)))) {
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
  }

  const path = getSolutionPath(year, day, 1);
  if (!(await hasFile(path))) {
    await writeFile(path, solutionTemplate);
  }

  console.log(chalk.green('Puzzle successfully initialized'));

  // Open solution files in the vscode
  execa('code', ['-r', getSolutionPath(year, day)]);
};

module.exports = init;
