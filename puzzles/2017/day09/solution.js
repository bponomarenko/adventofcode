export const formatInput = input => {
  const groups = [];
  // flag which indicates that next char after "!" should be ignored
  let ignoreNext = false;
  // flag to indicate garbage content
  let garbage = false;
  let garbageLength = 0;
  // contains reference to the currently opened group
  let groupRef = null;

  input.split('').forEach(char => {
    if (ignoreNext) {
      // Skip this character
      ignoreNext = false;
      return;
    }

    switch (char) {
      case '{':
        if (!garbage) {
          const newGroup = { parent: groupRef, children: [] };
          (groupRef ? groupRef.children : groups).push(newGroup);
          groupRef = newGroup;
        } else {
          garbageLength += 1;
        }
        break;
      case '}':
        if (!garbage) {
          if (!groupRef) {
            throw new Error('Closing group while there is no active group.');
          }
          groupRef = groupRef.parent;
        } else {
          garbageLength += 1;
        }
        break;
      case '<':
        if (!garbage) {
          // mark following content as garbage
          garbage = true;
          garbageLength = 0;
        } else {
          garbageLength += 1;
        }
        break;
      case '>':
        if (!garbage) {
          throw new Error('Closed garbage block without opening tag.');
        }
        (groupRef ? groupRef.children : groups).push({ garbage: true, len: garbageLength });
        garbage = false;
        break;
      case '!':
        ignoreNext = true;
        break;
      default:
        if (garbage) {
          garbageLength += 1;
        }
        // Just content – ignore
        break;
    }
  });
  return groups;
};

const getSum = (groups, level) => groups
  // remove garbage blocks
  .filter(({ garbage }) => !garbage)
  .reduce((acc, { children }) => acc + level + getSum(children, level + 1), 0);

export const part1 = input => getSum(input, 1);

// Count amount of the remove garbage characters this time
const getSum2 = groups => groups.reduce((acc, { garbage, len, children }) => acc + (garbage ? len : getSum2(children)), 0);

export const part2 = input => getSum2(input);
