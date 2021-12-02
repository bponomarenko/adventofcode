const parseValue = value => {
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? value : num;
};

const formatInput = input => input.split('\n').map(line => {
  const [instruction, value1, value2] = line.split(' ');
  return { instruction, value1: parseValue(value1), value2: parseValue(value2) };
});

const part1 = input => {
  const registers = new Map();
  let played;
  let offset = 0;

  const getValue = key => (typeof key === 'string' ? registers.get(key) || 0 : key);

  do {
    const { instruction, value1, value2 } = input[offset];
    if (instruction === 'jgz') {
      offset += getValue(value1) > 0 ? getValue(value2) : 1;
    } else {
      switch (instruction) {
        case 'snd':
          played = getValue(value1);
          break;
        case 'set':
          registers.set(value1, getValue(value2));
          break;
        case 'add':
          registers.set(value1, getValue(value1) + getValue(value2));
          break;
        case 'mul':
          registers.set(value1, getValue(value1) * getValue(value2));
          break;
        case 'mod':
          registers.set(value1, getValue(value1) % getValue(value2));
          break;
        case 'rcv':
          if (getValue(value1) !== 0) {
            return played;
          }
          break;
        default:
        // Do nothing
          break;
      }
      offset += 1;
    }
  } while (offset >= 0 && offset < input.length);
  throw new Error('should return earlier');
};

class Program {
  constructor(id, instructions) {
    this.instructions = instructions;
    this.registers = new Map([['p', id]]);
    this.counter = 0;
    this.queue = [];
    this.offset = 0;
    this.partner = null;
    this.isWaiting = false;
  }

  getValue(key) {
    if (typeof key === 'string') {
      return this.registers.has(key) ? this.registers.get(key) : 0;
    }
    return key;
  }

  setPartner(partner) {
    this.partner = partner;
  }

  addToQueue(value) {
    this.queue.unshift(value);
    // Queue is not empty, so not waiting anymore
    this.isWaiting = false;
  }

  run() {
    const { instruction, value1, value2 } = this.instructions[this.offset];
    if (instruction === 'jgz') {
      this.offset += this.getValue(value1) > 0 ? this.getValue(value2) : 1;
    } else {
      switch (instruction) {
        case 'snd':
          this.partner.addToQueue(this.getValue(value1));
          this.counter += 1;
          break;
        case 'set':
          this.registers.set(value1, this.getValue(value2));
          break;
        case 'add':
          this.registers.set(value1, this.getValue(value1) + this.getValue(value2));
          break;
        case 'mul':
          this.registers.set(value1, this.getValue(value1) * this.getValue(value2));
          break;
        case 'mod':
          this.registers.set(value1, this.getValue(value1) % this.getValue(value2));
          break;
        case 'rcv':
          if (this.queue.length === 0) {
            // Indicate that we are waiting for a new input now
            this.isWaiting = true;
            return;
          }
          this.isWaiting = false;
          this.registers.set(value1, this.queue.pop());
          break;
        default:
          throw new Error('unexpected instructin');
      }
      this.offset += 1;
    }
  }
}

const part2 = input => {
  const p0 = new Program(0, input);
  const p1 = new Program(1, input);

  p0.setPartner(p1);
  p1.setPartner(p0);

  let program = p0;
  let nextProgram = p1;

  do {
    program.run();
    if (program.isWaiting) {
      // Switch!
      [nextProgram, program] = [program, nextProgram];
    }
    // Let both programs run until both of them has empty queue
  } while (!program.isWaiting);
  return p1.counter;
};

module.exports = { part1, part2, formatInput };
