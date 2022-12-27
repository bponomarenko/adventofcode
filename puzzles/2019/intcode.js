export default class Intcode {
  #program;
  #pauseOnOutput = false;
  #addr = 0;
  #parsedInstruction;
  #relBase = 0;
  #convertOutput;
  #inputFallback;
  #runTick = false;

  input = [];
  output = [];

  constructor(program, options) {
    this.#program = program.split(',').map(Number);
    this.#pauseOnOutput = options?.autoRun === false;
    this.#addr = options?.addr ?? 0;
    this.#relBase = options?.relBase ?? 0;
    this.#convertOutput = options?.convertOutput;
    this.#inputFallback = options?.inputFallback;
    this.#runTick = !!options?.runTick;
    this.input = options?.input ?? [];

    if (options?.autoRun !== false) {
      this.run();
    }
  }

  get lastOutput() {
    return this.output.at(-1);
  }

  get halted() {
    return this.#currentInstruction.opcode === 99;
  }

  get firstInstruction() {
    return this.#program[0];
  }

  run(...input) {
    this.input.push(...input);

    while (!this.halted) {
      const pauseAfter = this.#currentInstruction.opcode === 4 && this.#pauseOnOutput;
      this.#processInstruction();
      if (pauseAfter || this.#runTick) {
        break;
      }
    }
    return this;
  }

  clone() {
    return new Intcode(this.#program.join(','), {
      input: Array.from(this.input),
      pauseOnOutput: this.#pauseOnOutput,
      addr: this.#addr,
      relBase: this.#relBase,
      autoRun: false,
      convertOutput: this.#convertOutput,
      inputFallback: this.#inputFallback,
      runTick: this.#runTick,
    });
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
    switch (this.#currentInstruction.opcode) {
      case 1:
        this.#setValue(3, this.#getValue(1) + this.#getValue(2));
        this.#moveAddressTo(this.#addr + 4);
        break;
      case 2:
        this.#setValue(3, this.#getValue(1) * this.#getValue(2));
        this.#moveAddressTo(this.#addr + 4);
        break;
      case 3:
        this.#setValue(1, this.input.length > 0 ? this.input.shift() : this.#inputFallback?.());
        this.#moveAddressTo(this.#addr + 2);
        break;
      case 4:
        this.output.push(this.#convertOutput ? this.#convertOutput(this.#getValue(1)) : this.#getValue(1));
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
        throw new Error(`Received unexpected opcode "${this.#currentInstruction.opcode}" at address "${this.#addr}".`);
    }
  }
}
