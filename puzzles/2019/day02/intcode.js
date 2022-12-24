export default class Intcode {
  #addr;
  #program;

  run(program) {
    this.#addr = 0;
    this.#program = Array.from(program);

    while (this.#currentOpcode !== 99) {
      this.#processInstruction();
    }
    return Array.from(this.#program);
  }

  get #currentOpcode() {
    return this.#program[this.#addr];
  }

  #getValue(addr) {
    return this.#program[this.#program[addr]];
  }

  #setValue(addr, value) {
    this.#program[addr] = value;
  }

  #processInstruction() {
    switch (this.#currentOpcode) {
      case 1:
        this.#setValue(this.#program[this.#addr + 3], this.#getValue(this.#addr + 1) + this.#getValue(this.#addr + 2));
        this.#addr += 4;
        break;
      case 2:
        this.#setValue(this.#program[this.#addr + 3], this.#getValue(this.#addr + 1) * this.#getValue(this.#addr + 2));
        this.#addr += 4;
        break;
      default:
        throw new Error(`Received unexpected opcode "${this.#currentOpcode}" at address "${this.#addr}".`);
    }
  }
}
