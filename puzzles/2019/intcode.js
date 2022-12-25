export default class Intcode {
  #program;
  #input;
  #paused = false;
  #pauseOnOutput = false;
  #addr = 0;
  #parsedInstruction;
  #relBase = 0;

  output = [];

  constructor(program, options) {
    this.#program = Array.from(program);
    this.#pauseOnOutput = !!options?.pauseOnOutput;
    this.#input = options?.input ?? [];

    if (options?.autoRun !== false) {
      this.run();
    }
  }

  get lastOutput() {
    return this.output.at(-1);
  }

  get paused() {
    return this.#paused;
  }

  get halted() {
    return this.#currentOpcode === 99;
  }

  get program() {
    return [...this.#program];
  }

  run(...input) {
    if (!this.#paused) {
      this.#addr = 0;
      this.#relBase = 0;
    }
    this.#paused = false;
    this.#input.push(...input);

    while (!this.halted) {
      const pauseAfter = this.#currentOpcode === 4 && this.#pauseOnOutput;
      this.#processInstruction();

      if (pauseAfter && !this.halted) {
        this.#paused = true;
        return this;
      }
    }
    return this;
  }

  get #currentInstruction() {
    if (!this.#parsedInstruction) {
      const instruction = this.#program[this.#addr];
      this.#parsedInstruction = {
        opcode: instruction % 100,
        modes: [
          Math.floor((instruction % 1000) / 100),
          Math.floor((instruction % 10000) / 1000),
          Math.floor((instruction % 100000) / 10000),
        ],
      };
    }
    return this.#parsedInstruction;
  }

  get #currentOpcode() {
    return this.#currentInstruction.opcode;
  }

  #getValue(addrShift) {
    const value = this.#program[this.#addr + addrShift];
    switch (this.#getParamMode(addrShift)) {
      case 2:
        return this.#program[value + this.#relBase] ?? 0;
      case 1:
        return value;
      default:
        return this.#program[value] ?? 0;
    }
  }

  #setValue(addrShift, value) {
    const addr = this.#program[this.#addr + addrShift];
    const writeAddr = addr + (this.#getParamMode(addrShift) === 2 ? this.#relBase : 0);
    this.#program[writeAddr] = value;
  }

  #getParamMode(addrShift) {
    return this.#currentInstruction.modes[addrShift - 1];
  }

  #moveAddressTo(addr) {
    this.#addr = addr;
    this.#parsedInstruction = null;
  }

  #processInstruction() {
    switch (this.#currentOpcode) {
      case 1:
        this.#setValue(3, this.#getValue(1) + this.#getValue(2));
        this.#moveAddressTo(this.#addr + 4);
        break;
      case 2:
        this.#setValue(3, this.#getValue(1) * this.#getValue(2));
        this.#moveAddressTo(this.#addr + 4);
        break;
      case 3:
        this.#setValue(1, this.#input.shift());
        this.#moveAddressTo(this.#addr + 2);
        break;
      case 4:
        this.output.push(this.#getValue(1));
        this.#moveAddressTo(this.#addr + 2);
        break;
      case 5:
        if (this.#getValue(1) !== 0) {
          this.#moveAddressTo(this.#getValue(2));
        } else {
          this.#moveAddressTo(this.#addr + 3);
        }
        break;
      case 6:
        if (this.#getValue(1) === 0) {
          this.#moveAddressTo(this.#getValue(2));
        } else {
          this.#moveAddressTo(this.#addr + 3);
        }
        break;
      case 7:
        this.#setValue(3, this.#getValue(1) < this.#getValue(2) ? 1 : 0);
        this.#moveAddressTo(this.#addr + 4);
        break;
      case 8:
        this.#setValue(3, this.#getValue(1) === this.#getValue(2) ? 1 : 0);
        this.#moveAddressTo(this.#addr + 4);
        break;
      case 9:
        this.#relBase += this.#getValue(1);
        this.#moveAddressTo(this.#addr + 2);
        break;
      default:
        throw new Error(`Received unexpected opcode "${this.#currentOpcode}" at address "${this.#addr}".`);
    }
  }
}
