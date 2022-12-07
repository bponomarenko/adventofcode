import { sum } from '../../utils/collections.js';

export const formatInput = input => {
  const commands = [];
  let activeCommand;

  input.split('\n').forEach(line => {
    if (line.startsWith('$')) {
      const [, type, ...args] = line.split(' ');
      activeCommand = { type, args };
      commands.push(activeCommand);
    } else {
      activeCommand.args.push(line);
    }
  });
  return commands;
};

// Calculcates size for each directory in the filesystem
const calcSize = root => {
  const dirSizes = Object.values(root.dirs).map(calcSize);
  root.size = sum(Object.values(root.files)) + sum(dirSizes);
  return root.size;
};

const runCommands = commands => {
  const computer = { files: {}, dirs: {}, path: [] };
  let folder;

  commands.forEach(command => {
    switch (command.type) {
      case 'cd':
        switch (command.args[0]) {
          case '/':
            computer.path = [];
            break;
          case '..':
            computer.path.pop();
            break;
          default:
            computer.path.push(command.args[0]);
            break;
        }
        break;
      case 'ls':
        // Get current directory
        folder = computer.path.reduce((root, name) => root.dirs[name], computer);
        // Fill directory with files and sub-directories
        command.args.forEach(arg => {
          const [type, name] = arg.split(' ');
          if (type === 'dir') {
            // Add new directory
            folder.dirs[name] = { files: {}, dirs: {} };
          } else {
            // Add file ("type" if file size in this case)
            folder.files[name] = +type;
          }
        });
        break;
    }
  });
  calcSize(computer);
  return computer;
};

// Calculates total filesystem size (with directories at most 100000 in size)
const getTotalSize = root => (root.size <= 100000 ? root.size : 0) + sum(Object.values(root.dirs).map(getTotalSize));

export const part1 = input => getTotalSize(runCommands(input));

const getDirSizes = root => [root.size].concat(Object.values(root.dirs).flatMap(dir => getDirSizes(dir)));

export const part2 = input => {
  const computer = runCommands(input);
  const toFree = computer.size - 40000000;
  return getDirSizes(computer).sort((a, b) => a - b).find(size => size >= toFree);
};
