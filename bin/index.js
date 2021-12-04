#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import prompt from 'prompt';
import chokidar from 'chokidar';
import { readInput, getYearPath, ManagedError } from '../lib/utils.js';
import { submitAnswer } from '../lib/answers.js';

// zero-width whitespace character
const zwws = '​';

prompt.delimiter = zwws;
prompt.message = chalk.gray.dim('>');

const withDayAndYear = command => command
  .option('-y, --year <year>', 'Year of the puzzle to scaffold', Number, process.env.YEAR ? +process.env.YEAR : new Date().getFullYear())
  .option('-d, --day <day>', 'Day of the puzzle to scaffold', Number, new Date().getDate());

const runCommand = async ({ name, ...args }) => {
  const module = await import(`../lib/${name}.js`);
  return module.default(args);
};

const getLogMeta = args => `${new Date().toLocaleTimeString()} (y:${args.year} d:${args.day} p:${args.part})`;

const watchAndRunCommand = ({ name, onResult, onCommand, ...args }) => {
  console.clear();
  console.log(chalk.gray.dim(`Starting in the watch mode ${getLogMeta(args)}`));

  let watcher;

  const run = async () => {
    const result = await runCommand({ name, ...args });
    if (onResult) {
      await onResult(result);
    }
    //  Print empty line after messages
    console.log();
  };

  const restart = async path => {
    console.clear();
    console.log(chalk.gray.dim(`Restarted ${getLogMeta(args)}`));

    // if (path) {
    //   // Make sure we always load not cached version
    //   delete require.cache[resolve(path)];
    // }
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
          args.part = args.part === 1 ? 2 : 1;
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
    .watch(['lib/', getYearPath(args.year)], { ignoreInitial: true })
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
  .action(args => runCommand({ name: 'init', ...args }));

withDayAndYear(program.command('solve'))
  .argument('[part]', 'Defines which part of the solution to run – part 1 or part 2', Number, 1)
  .description('Runs puzzle solution code with specified input and prints the answer')
  .option('--no-init', 'Do not scaffold the solution before solving it')
  .option('--no-watch', 'Do not run solution in a watch mode')
  .option('--no-validate', 'Do not run validation test cases prior to solving a solution')
  .action(async (part, { watch, init, ...args }) => {
    if (init) {
      // Initialize the project first
      await runCommand({ name: 'init', ...args });
    }

    const cmdArgs = { name: 'solve', part, ...args };
    if (watch) {
      let latestAnswer;

      const onResult = result => {
        latestAnswer = result?.answer;
      };

      const onCommand = async (cmd, currentArgs) => {
        // "submit" command, which will try to submit last known result
        if (cmd === 's') {
          await submitAnswer(latestAnswer, cmdArgs.year, cmdArgs.day, cmdArgs.part);
          if (currentArgs.part === 1) {
            currentArgs.part = currentArgs.part === 1 ? 2 : 1;
            return true;
          }
          if (currentArgs.part === 2) {
            // Done solving of the day. Treat myself with some fun stuff
            await runCommand({ name: 'easter-eggs', ...args });
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
  .action(async (part, answer, inputArg, args) => {
    const input = inputArg || await readInput();
    return runCommand({ name: 'add-test', part, input, answer, ...args });
  });

withDayAndYear(program.command('validate'))
  .argument('[part]', 'Defines which part of the solution to run – part 1 or part 2', Number, 1)
  .option('--no-watch', 'Do not run solution in a watch mode')
  .action((part, { watch, ...args }) => {
    const cmdArgs = { name: 'validate', part, ...args };
    return watch ? watchAndRunCommand(cmdArgs) : runCommand(cmdArgs);
  });

withDayAndYear(program.command('easter-eggs'))
  .description('Tries to find easter-eggs on the puzzle page (words with additional info on them), and prints links to them')
  .action(args => runCommand({ name: 'easter-eggs', ...args }));

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
