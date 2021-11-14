const { mkdir, writeFile } = require('fs/promises');
const chalk = require('chalk');
const { getInput } = require('./client');

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
  const basePath = `puzzles/${year}/day${day}`;
  await mkdir(basePath, { recursive: true });

  // Create file with input
  await writeFile(`${basePath}/input.txt`, input);
  await writeFile(`${basePath}/part1.js`, solutionTemplate1);
  await writeFile(`${basePath}/part2.js`, solutionTemplate2);

  // TODO: open solution files in the vscode

  console.log(chalk.green('Puzzle successfully initialized'));
};

module.exports = init;
