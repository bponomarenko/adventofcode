import Intcode from '../intcode.js';

export const formatInput = input => input;

const toAscii = str => str.split('').map(char => char.charCodeAt(0)).concat(10);
const roomRe = /.*==\s(.*)\s==[\s\S]*lead:\s((?:- .*\s)+)(?:[\s\S]*here:\s((?:- .*\s)+))?/;
const finish = 'on the keypad at the main airlock."';

const doMove = (intcode, cmd, doNotParse) => {
  if (cmd) {
    intcode.input.push(...toAscii(cmd));
  }

  // Run computer until input prompt
  let output;
  do {
    output = intcode.run().output.join('');
  } while (!output.endsWith('Command?') && !output.endsWith(finish));

  // reset output
  intcode.output.length = 0;

  if (doNotParse) {
    return output.endsWith(finish) ? +output.split(' ').at(-8) : null;
  }

  // parse output
  const [, name, doors, items] = output.match(roomRe);
  return [name, {
    doors: Object.fromEntries(doors.split('\n').filter(Boolean).map(door => [door.slice(2)])),
    items: items?.split('\n').filter(Boolean).map(item => item.slice(2)),
  }];
};

const getUnexploredRoom = (rooms, name) => Object.entries(rooms[name].doors).find(door => !door[1])?.[0];
const hasUnexploredRooms = rooms => Object.keys(rooms).some(room => getUnexploredRoom(rooms, room));
const directions = ['north', 'east', 'south', 'west'];
const getBackMove = move => directions[(directions.indexOf(move) + 2) % directions.length];
const securityRoom = 'Security Checkpoint';
const doNotPickUp = ['infinite loop', 'giant electromagnet', 'molten lava', 'photons', 'escape pod'];

function* comboCommands(items) {
  const l = items.length;
  for (let i = 0; i < l; i += 1) {
    yield i > 0 ? [`drop ${items[i - 1]}`, `take ${items[i]}`] : [`take ${items[i]}`];

    if (l > 1 && i < l - 1) {
      yield* comboCommands(items.slice(i + 1));
    }
  }
  yield [`drop ${items[l - 1]}`];
}

export const part1 = async input => {
  const intcode = new Intcode(input, {
    autoRun: false,
    convertOutput: value => String.fromCharCode(value),
  });

  const start = doMove(intcode);
  const rooms = Object.fromEntries([start]);
  const path = [];
  const pickedItems = [];
  let securityPath;
  let securityMove;
  let currentRoom = start[0];

  for (; ;) {
    if (currentRoom === securityRoom) {
      securityMove = getUnexploredRoom(rooms, currentRoom);
      rooms[currentRoom].doors[securityMove] = securityRoom;
      securityPath = securityPath || [...path];
      if (!hasUnexploredRooms(rooms)) {
        break;
      }
    }

    // Pick up items, if there are any
    const { items } = rooms[currentRoom];
    if (items?.length) {
      do {
        const item = items.shift();
        if (!doNotPickUp.includes(item)) {
          doMove(intcode, `take ${item}`, true);
          pickedItems.push(item);
        }
      } while (items.length);
    }

    const move = getUnexploredRoom(rooms, currentRoom);
    if (move) {
      // Explore new room
      const [name, room] = doMove(intcode, move);
      const moveBack = getBackMove(move);
      rooms[name] = { ...room, doors: { ...room.doors, [moveBack]: currentRoom } };
      rooms[currentRoom].doors[move] = name;
      currentRoom = name;
      path.push(move);
      continue;
    }

    if (path.length) {
      // Go back to previous room
      const moveBack = getBackMove(path.pop());
      doMove(intcode, moveBack, true);
      currentRoom = rooms[currentRoom].doors[moveBack];
      continue;
    }
    break;
  }

  // Move to the security check room and drop all items
  securityPath.forEach(move => doMove(intcode, move, true));
  pickedItems.forEach(item => doMove(intcode, `drop ${item}`, true));

  // Find a correct combination of items to pass through
  for (const combo of comboCommands(pickedItems)) {
    combo.forEach(move => doMove(intcode, move, true));
    const answer = doMove(intcode, securityMove, true);
    if (answer) {
      return answer;
    }
  }
  return null;
};

// Traditionally, there is no part2 on the 25th day. Yay
export const part2 = () => null;
