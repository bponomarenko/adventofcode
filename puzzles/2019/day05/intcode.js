const parseMode = (opcode, index) => {
  const num = +opcode.at(-3 - index);
  return Number.isNaN(num) ? 0 : num;
};

class Intcode {
  constructor(program, pauseOnOutput = false, ...input) {
    this.program = Array.from(program);
    this.pauseOnOutput = pauseOnOutput;
    this.input = input;
    this.output = [];
    this.addr = 0;
    this.relBase = 0;
    this.paused = false;
  }

  run(...input) {
    if (!this.paused) {
      this.addr = 0;
    }
    this.paused = false;
    this.input.push(...input);

    while (!this.halted) {
      const pauseAfter = this.getCurrentOpcode() === 4 && this.pauseOnOutput;
      this.processInstruction();

      if (pauseAfter && !this.halted) {
        this.paused = true;
        return this.output;
      }
    }
    return this.output;
  }

  getValue(addrShift) {
    const value = this.program[this.addr + addrShift];
    const mode = this.getCurrentInstruction().modes[addrShift - 1];
    switch (mode) {
      case 2:
        return this.program[value + this.relBase] ?? 0;
      case 1:
        return value;
      default:
        return this.program[value] ?? 0;
    }
  }

  setValue(addrShift, value) {
    const mode = this.getCurrentInstruction().modes[addrShift - 1];
    const addr = this.program[this.addr + addrShift];
    const writeAddr = mode === 2 ? addr + this.relBase : addr;
    this.program[writeAddr] = value;
  }

  getCurrentInstruction() {
    if (!this.parsedInstruction) {
      const opcode = String(this.program[this.addr]);
      if (opcode === '99') {
        this.parsedInstruction = { opcode: 99 };
      } else {
        this.parsedInstruction = {
          opcode: +opcode.slice(-2),
          modes: [parseMode(opcode, 0), parseMode(opcode, 1), parseMode(opcode, 2)],
        };
      }
    }
    return this.parsedInstruction;
  }

  getCurrentOpcode() {
    return this.getCurrentInstruction().opcode;
  }

  get halted() {
    return this.getCurrentOpcode() === 99;
  }

  get lastOutput() {
    return this.output.at(-1);
  }

  moveAddressTo(value) {
    this.addr = value;
    this.parsedInstruction = null;
  }

  processInstruction() {
    switch (this.getCurrentOpcode()) {
      case 1:
        this.setValue(3, this.getValue(1) + this.getValue(2));
        this.moveAddressTo(this.addr + 4);
        break;
      case 2:
        this.setValue(3, this.getValue(1) * this.getValue(2));
        this.moveAddressTo(this.addr + 4);
        break;
      case 3:
        this.setValue(1, this.input.shift());
        this.moveAddressTo(this.addr + 2);
        break;
      case 4:
        this.output.push(this.getValue(1));
        this.moveAddressTo(this.addr + 2);
        break;
      case 5:
        if (this.getValue(1) !== 0) {
          this.moveAddressTo(this.getValue(2));
        } else {
          this.moveAddressTo(this.addr + 3);
        }
        break;
      case 6:
        if (this.getValue(1) === 0) {
          this.moveAddressTo(this.getValue(2));
        } else {
          this.moveAddressTo(this.addr + 3);
        }
        break;
      case 7:
        this.setValue(3, this.getValue(1) < this.getValue(2) ? 1 : 0);
        this.moveAddressTo(this.addr + 4);
        break;
      case 8:
        this.setValue(3, this.getValue(1) === this.getValue(2) ? 1 : 0);
        this.moveAddressTo(this.addr + 4);
        break;
      case 9:
        this.relBase += this.getValue(1);
        this.moveAddressTo(this.addr + 2);
        break;
      default:
        throw new Error(`Received unexpected opcode "${this.getCurrentOpcode()}" at address "${this.addr}".`);
    }
  }
}

export default Intcode;
