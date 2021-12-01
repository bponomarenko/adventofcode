const { formatInput } = require('./part1');

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

const main = input => {
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
  } while (!program.isWaiting);
  return p1.counter;
};

module.exports = { main: input => main(formatInput(input)) };
