class Intcode {
  run(program) {
    this.addr = 0;
    this.program = Array.from(program);

    while (this.getCurrentOpcode() !== 99) {
      this.processInstruction();
    }
    return Array.from(this.program);
  }

  getValue(addr) {
    return this.program[this.program[addr]];
  }

  setValue(addr, value) {
    this.program[addr] = value;
  }

  getCurrentOpcode() {
    return this.program[this.addr];
  }

  processInstruction() {
    switch (this.getCurrentOpcode()) {
      case 1:
        this.setValue(this.program[this.addr + 3], this.getValue(this.addr + 1) + this.getValue(this.addr + 2));
        this.addr += 4;
        break;
      case 2:
        this.setValue(this.program[this.addr + 3], this.getValue(this.addr + 1) * this.getValue(this.addr + 2));
        this.addr += 4;
        break;
      default:
        throw new Error(`Received unexpected opcode "${this.getCurrentOpcode()}" at address "${this.addr}".`);
    }
  }
}

export default Intcode;
