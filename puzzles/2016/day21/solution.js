export const formatInput = input => input.split('\n');

const swapPosRe = /swap position (\d) with position (\d)/;
const swapCharRe = /swap letter (\w) with letter (\w)/;
const rotateLeftRe = /rotate left (\d) steps?/;
const rotateRightRe = /rotate right (\d) steps?/;
const rotateRe = /rotate based on position of letter (\w)/;
const reverseRe = /reverse positions (\d) through (\d)/;
const moveRe = /move position (\d) to position (\d)/;

export const part1 = input => {
  let pass = 'abcdefgh'.split('');

  input.forEach(operation => {
    let match;
    // eslint-disable-next-line no-cond-assign
    if (match = swapPosRe.exec(operation)) {
      const pos1 = +match[1];
      const pos2 = +match[2];
      [pass[pos1], pass[pos2]] = [pass[pos2], pass[pos1]];
    // eslint-disable-next-line no-cond-assign
    } else if (match = swapCharRe.exec(operation)) {
      const pos1 = pass.indexOf(match[1]);
      const pos2 = pass.indexOf(match[2]);
      [pass[pos1], pass[pos2]] = [pass[pos2], pass[pos1]];
    // eslint-disable-next-line no-cond-assign
    } else if (match = rotateLeftRe.exec(operation)) {
      for (let i = 0; i < +match[1]; i += 1) {
        pass.push(pass.shift());
      }
    // eslint-disable-next-line no-cond-assign
    } else if (match = rotateRightRe.exec(operation)) {
      for (let i = 0; i < +match[1]; i += 1) {
        pass.unshift(pass.pop());
      }
    // eslint-disable-next-line no-cond-assign
    } else if (match = rotateRe.exec(operation)) {
      let count = pass.indexOf(match[1]);
      count += 1 + (count >= 4 ? 1 : 0);
      for (let i = 0; i < count; i += 1) {
        pass.unshift(pass.pop());
      }
    // eslint-disable-next-line no-cond-assign
    } else if (match = reverseRe.exec(operation)) {
      const pos1 = +match[1];
      const pos2 = +match[2];
      pass.splice(pos1, pos2 - pos1 + 1, ...pass.slice(pos1, pos2 + 1).reverse());
    // eslint-disable-next-line no-cond-assign
    } else if (match = moveRe.exec(operation)) {
      pass.splice(+match[2], 0, pass.splice(+match[1], 1)[0]);
    }
  });
  return pass.join('');
};

export const part2 = input => {
  let pass = 'fbgdceah'.split('');

  input.reverse().forEach(operation => {
    let match;
    // eslint-disable-next-line no-cond-assign
    if (match = swapPosRe.exec(operation)) {
      const pos1 = +match[1];
      const pos2 = +match[2];
      [pass[pos1], pass[pos2]] = [pass[pos2], pass[pos1]];
    // eslint-disable-next-line no-cond-assign
    } else if (match = swapCharRe.exec(operation)) {
      const pos1 = pass.indexOf(match[1]);
      const pos2 = pass.indexOf(match[2]);
      [pass[pos1], pass[pos2]] = [pass[pos2], pass[pos1]];
    // eslint-disable-next-line no-cond-assign
    } else if (match = rotateLeftRe.exec(operation)) {
      for (let i = 0; i < +match[1]; i += 1) {
        pass.unshift(pass.pop());
      }
    // eslint-disable-next-line no-cond-assign
    } else if (match = rotateRightRe.exec(operation)) {
      for (let i = 0; i < +match[1]; i += 1) {
        pass.push(pass.shift());
      }
    // eslint-disable-next-line no-cond-assign
    } else if (match = rotateRe.exec(operation)) {
      const index = pass.indexOf(match[1]);
      let count;
      if (index % 2 === 1) {
        count = Math.ceil(index / 2);
      } else {
        switch (index) {
          case 2:
            count = 6;
            break;
          case 4:
            count = 7;
            break;
          case 6:
            count = 8;
            break;
          case 0:
            count = 9;
            break;
        }
      }
      for (let i = 0; i < count; i += 1) {
        pass.push(pass.shift());
      }
    // eslint-disable-next-line no-cond-assign
    } else if (match = reverseRe.exec(operation)) {
      const pos1 = +match[1];
      const pos2 = +match[2];
      pass.splice(pos1, pos2 - pos1 + 1, ...pass.slice(pos1, pos2 + 1).reverse());
    // eslint-disable-next-line no-cond-assign
    } else if (match = moveRe.exec(operation)) {
      pass.splice(+match[1], 0, pass.splice(+match[2], 1)[0]);
    }
  });
  return pass.join('');
};
