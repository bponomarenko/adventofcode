const { readFile } = require('fs/promises');
const chalk = require('chalk');
const { getSolutionPath, getTestCasesPath } = require('./utils');

const validate = async (year, day, part) => {
  const testCases = JSON.parse(await readFile(getTestCasesPath(year, day), 'utf8'));
  const solution = require(`../${getSolutionPath(year, day, part)}`);

  const promises = testCases
    .filter(testCase => testCase.part === part)
    .map(async ({ input, answer }, index) => {
      const actualAnswer = await solution.main(input.trim());

      // eslint-disable-next-line eqeqeq -- we can compare strings to numbers here
      const valid = actualAnswer == answer;
      if (!valid) {
        console.log(chalk`Test case ${index + 1}: {red invalid}\n\n\tExpected:\t{dim {green ${answer}}}\n\tActual:\t\t{dim {red ${actualAnswer}}}\n`);
      } else {
        console.log(chalk`Test case ${index + 1}: {green valid}`);
      }
      return valid;
    });

  if (promises.length === 0) {
    console.log(chalk`{yellow There are no test cases for part ${part}}`);
    return true;
  }
  const results = await Promise.all(promises);
  return results.every(Boolean);
};

module.exports = validate;
