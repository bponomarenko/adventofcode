const { readFile, writeFile } = require('fs/promises');
const chalk = require('chalk');
const { getTestCasesPath } = require('./utils');

const addTest = async ({ year, day, part, input, answer }) => {
  const path = getTestCasesPath(year, day);
  let testCases = [];

  try {
    testCases = JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    // If file doesn't exist – ignore the error
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  testCases.push({ input, answer, part });
  await writeFile(path, JSON.stringify(testCases, null, 2));
  console.log(chalk.green('Successfully added new test case'));
};

module.exports = addTest;
