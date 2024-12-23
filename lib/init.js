import { stat, mkdir, writeFile } from 'fs/promises';
import chalk from 'chalk';
import { execa } from 'execa';
import { getInput } from './client.js';
import { getPuzzlePath, getSolutionPath, getInputPath, ManagedError } from './utils.js';

const part2 = `
export const part2 = input => {
  console.log(input);
  return null;
};
`.slice(1, -1);
const lastDayPart2 = `
// There is no coding challenge for the part 2, yay :)
export const part2 = () => 'That\\'s a wrap';
`.slice(1, -1);

const getSolutionTemplate = lastDay => `
export const formatInput = input => input;

export const part1 = input => {
  console.log(input);
  return null;
};

${lastDay ? lastDayPart2 : part2}
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

const init = async (year, day, open) => {
  if (!(await hasFile(getInputPath(year, day)))) {
    let input;
    try {
      // Try to load puzzle input first
      const res = await getInput(year, day);
      input = res.data;
    } catch (error) {
      if (error.response.status === 404) {
        throw new ManagedError('Puzzle is not available yet', error);
      }
      throw new Error(error.response?.data || error.message || error);
    }

    // Create puzzle folders
    await mkdir(getPuzzlePath(year, day), { recursive: true });
    // Create file with input
    await writeFile(getInputPath(year, day), input);
  }

  const path = getSolutionPath(year, day, 1);
  if (!(await hasFile(path))) {
    await writeFile(path, getSolutionTemplate(day === 25));
  }

  console.log(chalk.green('Puzzle successfully initialized'));

  if (open) {
    // Open solution files in the vscode
    execa('code', ['-r', getSolutionPath(year, day)]);
  }
};

export default init;
