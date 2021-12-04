#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import prompt from 'prompt';
import chokidar from 'chokidar';
import { execaNode } from 'execa';
import initPuzzle from '../lib/init.js';
import addTest from '../lib/add-test.js';
import findEasterEgg from '../lib/easter-egg.js';
import { submitAnswer } from '../lib/answers.js';
import { readInput, getYearPath, ManagedError } from '../lib/utils.js';

// zero-width whitespace character
const zwws = '​';

prompt.delimiter = zwws;
prompt.message = chalk.gray.dim('>');

const withDayAndYear = command => command
  .option('-y, --year <year>', 'Year of the puzzle to scaffold', Number, process.env.YEAR ? +process.env.YEAR : new Date().getFullYear())
  .option('-d, --day <day>', 'Day of the puzzle to scaffold', Number, new Date().getDate());

const runCommand = ({ name, args }) => execaNode(`./lib/${name}.js`, args, {
  stdio: process.stdio,
  stdout: process.stdout,
});

const getLogMeta = (year, day, part) => `${new Date().toLocaleTimeString()} (y:${year} d:${day} p:${part})`;

const watchAndRunCommand = ({ name, onResult, onCommand, args }) => {
  console.clear();
  console.log(chalk.gray.dim(`Starting in the watch mode ${getLogMeta(...args)}`));

  let watcher;

  const run = async () => {
    const result = await runCommand({ name, args });
    if (onResult) {
      await onResult(result);
    }
    //  Print empty line after messages
    console.log();
  };

  const restart = async path => {
    console.clear();
    console.log(chalk.gray.dim(`Restarted ${getLogMeta(...args)}`));

    await run();
    if (path) {
      // Bring back command prompt after console being cleared
      process.stdout.write(`${prompt.message} `);
    }
  };

  const readCmd = async () => {
    try {
    // Read for additional commands from the command line
      const { cmd } = await prompt.get([{ name: 'cmd', message: zwws }]);
      let doRestart = await onCommand?.(cmd, args);
      switch (cmd) {
        case 'r':
          doRestart = true;
          break;
        case 'c':
          args[2] = args[2] === 1 ? 2 : 1;
          doRestart = true;
          break;
      }

      if (doRestart) {
        await restart();
      }
    } catch (error) {
      process.emit('SIGINT');
      return;
    }
    readCmd();
  };

  // Start watching project files
  watcher = chokidar
    .watch(['lib/', getYearPath(args[0])], {
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 100 },
    })
    .on('add', restart)
    .on('change', restart)
    .on('unlink', restart)
    .on('addDir', restart)
    .on('unlinkDir', restart)
    .on('ready', async () => {
      await run();

      // And start reading for additional commands
      prompt.start({ noHandleSIGINT: true });
      readCmd();
    });

  process.on('SIGINT', () => {
    prompt.stop();
    watcher.close();
  });
};

withDayAndYear(program.command('init'))
  .description('Scaffolds necessary files for a specific puzzle of the day and year')
  .action(({ year, day }) => initPuzzle(year, day));

withDayAndYear(program.command('solve'))
  .argument('[part]', 'Defines which part of the solution to run – part 1 or part 2', Number, 1)
  .description('Runs puzzle solution code with specified input and prints the answer')
  .option('--no-init', 'Do not scaffold the solution before solving it')
  .option('--no-watch', 'Do not run solution in a watch mode')
  .option('--no-validate', 'Do not run validation test cases prior to solving a solution')
  .action(async (part, { watch, init, year, day, validate }) => {
    if (init) {
      // Initialize the project first
      await initPuzzle(year, day);
    }

    const cmdArgs = { name: 'solve', args: [year, day, part, validate] };
    if (watch) {
      let latestAnswer;

      const onResult = result => {
        latestAnswer = result?.answer;
      };

      const onCommand = async (cmd, currentArgs) => {
        // "submit" command, which will try to submit last known result
        if (cmd === 's') {
          await submitAnswer(latestAnswer, ...currentArgs);
          if (currentArgs[2] === 1) {
            // switch to the part 2
            currentArgs[2] = 2;
            // ...and request watcher restart
            return true;
          }
          if (currentArgs[2] === 2) {
            // Done solving of the day. Treat myself with some fun stuff
            await findEasterEgg(year, day);
          }
        }
        return false;
      };
      return watchAndRunCommand({ ...cmdArgs, onResult, onCommand });
    }
    return runCommand(cmdArgs);
  });

withDayAndYear(program.command('add-test'))
  .argument('<part>', 'Defines which part of the solution to run – part 1 or part 2', Number)
  .argument('<answer>', 'Expected answer')
  .argument('[input]', 'Test input')
  .action(async (part, answer, inputArg, { year, day }) => {
    const input = inputArg || await readInput();
    return addTest(year, day, part, input, answer);
  });

withDayAndYear(program.command('validate'))
  .argument('[part]', 'Defines which part of the solution to run – part 1 or part 2', Number, 1)
  .option('--no-watch', 'Do not run solution in a watch mode')
  .action(async (part, { watch, year, day }) => {
    const cmdArgs = { name: 'validate', args: [year, day, part] };
    return watch ? watchAndRunCommand(cmdArgs) : runCommand(cmdArgs);
  });

withDayAndYear(program.command('easter-egg'))
  .description('Tries to find easter-eggs on the puzzle page (words with additional info on them), and prints links to them')
  .action(({ year, day }) => findEasterEgg(year, day));

(async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error(chalk`{red {inverse Error} ${error.message}}`);
    if (!(error instanceof ManagedError)) {
      // Also show error body
      console.error(error);
    }
    process.exitCode = 1;
  }
}());
