const readline = require('readline');

const getPuzzlePath = (year, day) => `puzzles/${year}/day${day > 9 ? '' : '0'}${day}`;

const getSolutionPath = (year, day, part) => `${getPuzzlePath(year, day)}/part${part}.js`;

const getTestCasesPath = (year, day) => `${getPuzzlePath(year, day)}/test-cases.json`;

const getInputPath = (year, day) => `${getPuzzlePath(year, day)}/input.txt`;

const readInput = async () => new Promise(resolve => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const lines = [];
  rl.write('Enter test input data:\n');
  rl.prompt();
  rl.on('line', line => {
    if (line.trim()) {
      lines.push(line.trim());
    } else {
      rl.close();
    }
  });
  rl.on('close', () => resolve(lines.join('\n')));
});

const getElapsedTime = start => {
  const elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
  return `${process.hrtime(start)[0]}.${elapsed > 1 ? elapsed.toFixed(0) : `0${(elapsed * 10).toFixed(0)}`}s`;
};

module.exports = {
  getPuzzlePath,
  getSolutionPath,
  getTestCasesPath,
  getInputPath,
  readInput,
  getElapsedTime,
};
