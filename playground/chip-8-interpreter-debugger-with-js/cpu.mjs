// @ts-check

// http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#2.4
const sprites = new Uint8Array([
  0xf0, 0x90, 0x90, 0x90, 0xf0, // 0
  0x20, 0x60, 0x20, 0x20, 0x70, // 1
  0xf0, 0x10, 0xf0, 0x80, 0xf0, // 2
  0xf0, 0x10, 0xf0, 0x10, 0xf0, // 3
  0x90, 0x90, 0xf0, 0x10, 0x10, // 4
  0xf0, 0x80, 0xf0, 0x10, 0xf0, // 5
  0xf0, 0x80, 0xf0, 0x90, 0xf0, // 6
  0xf0, 0x10, 0x20, 0x40, 0x40, // 7
  0xf0, 0x90, 0xf0, 0x90, 0xf0, // 8
  0xf0, 0x90, 0xf0, 0x10, 0xf0, // 9
  0xf0, 0x90, 0xf0, 0x90, 0x90, // A
  0xe0, 0x90, 0xe0, 0x90, 0xe0, // B
  0xf0, 0x80, 0x80, 0x80, 0xf0, // C
  0xe0, 0x90, 0x90, 0x90, 0xe0, // D
  0xf0, 0x80, 0xf0, 0x80, 0xf0, // E
  0xf0, 0x80, 0xf0, 0x80, 0x80, // F
]);

const startAddress = 0x200;

/**
 * @typedef { import("./display.mjs").default } Display
 * @typedef { import("./keyboard.mjs").default } Keyboard
 * @typedef { import("./speaker.mjs").default } Speaker
 */

export default class CPU {
  constructor({ display, keyboard, speaker }) {
    /** @type {Display} */
    this.display = display;
    /** @type {Keyboard} */
    this.keyboard = keyboard;
    /** @type {Speaker} */
    this.speaker = speaker;

    /** @type {Uint8Array} */
    this.registers = new Uint8Array(0x10);
    /** @type {Uint16Array} */
    this.stack = new Uint16Array(0x10);
    /** @type {Uint8Array} */
    this.memory = new Uint8Array(0x1000);

    this.pc = startAddress;
    this.i = 0;
    this.dt = 0;
    this.st = 0;
    this.sp = 0;

    this.reset();
  }

  reset() {
    this.registers.fill(0);
    this.stack.fill(0);
    this.memory.fill(0);

    this.pc = startAddress;
    this.i = 0;
    this.dt = 0;
    this.st = 0;
    this.sp = 0;

    for (let i = 0, l = sprites.length; i < l; i++) {
      this.memory[i] = sprites[i];
    }
  }

  /**
   * @param {Uint8Array} blob
   */
  load(blob) {
    this.display.clear();
    this.reset();

    for (let i = 0, l = blob.length; i < l; i++) {
      this.memory[0x200 + i] = blob[i];
    }
  }

  step() {
    const opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
    this.executeInstruction(opcode);

    this.updateTimers();
    this.renderDisplay();
    this.playSound();
  }

  executeInstruction(opcode) {
    this.pc += 2;

    const nnn = opcode & 0x0fff;
    const n = opcode & 0x000f;
    const x = (opcode & 0x0f00) >> 8;
    const y = (opcode & 0x00f0) >> 4;
    const kk = opcode & 0x00ff;

    switch (opcode & 0xf000) {
      case 0x0000:
        switch (opcode) {
          case 0x00e0: // CLS
            this.display.clear();
            break;
          case 0x00ee: // RET
            this.pc = this.stack[this.sp];
            this.sp -= 1;
            break;
        }
        break;
      case 0x1000: // JMP addr
        this.pc = nnn;
        break;
      case 0x2000: // CALL addr
        this.sp += 1;
        this.stack[this.sp] = this.pc;
        break;
      case 0x3000: // SE Vx, byte
        this.pc += this.registers[x] === kk ? 2 : 0;
        break;
      case 0x4000: // SNE Vx, byte
        this.pc += this.registers[x] !== kk ? 2 : 0;
        break;
      case 0x5000: // SE Vx, Vy
        this.pc += this.registers[x] === this.registers[y] ? 2 : 0;
        break;
      case 0x6000: // LD Vx, byte
        this.registers[x] = kk;
        break;
      case 0x7000: // ADD Vx, byte
        this.registers[x] += kk;
        break;
      case 0x8000:
        switch (n) {
          case 0x0: // LD Vx, Vy
            this.registers[x] = this.registers[y];
            break;
          case 0x1: // OR Vx, Vy
            this.registers[x] |= this.registers[y];
            break;
          case 0x2: // AND Vx, Vy
            this.registers[x] &= this.registers[y];
            break;
          case 0x3: // XOR Vx, Vy
            this.registers[x] ^= this.registers[y];
            break;
          case 0x4: // ADD Vx, Vy
            this.registers[x] += this.registers[y];
            this.registers[0xf] = this.registers[x] > 0xff ? 1 : 0;
            break;
          case 0x5: // SUB Vx, Vy
            this.registers[0xf] = this.registers[x] > this.registers[y] ? 1 : 0;
            this.registers[x] -= this.registers[y];
            break;
          case 0x6: // SHR Vx
            this.registers[0xf] = this.registers[x] & 0x1;
            this.registers[x] >>= 1;
            break;
          case 0x7: // SUBN Vx, Vy
            this.registers[0xf] = this.registers[y] > this.registers[x] ? 1 : 0;
            this.registers[x] = this.registers[y] - this.registers[x];
            break;
          case 0xe: // SHL Vx
            this.registers[0xf] = this.registers[x] >> 7;
            this.registers[x] <<= 1;
            break;
        }
        break;
      case 0x9000: // SNE Vx, Vy
        this.pc += this.registers[x] !== this.registers[y] ? 2 : 0;
        break;
      case 0xa000: // LD I, addr
        this.i = nnn;
        break;
      case 0xb000: // JP V0, addr
        this.pc = nnn + this.registers[0x0];
        break;
      case 0xc000: // RND Vx, byte
        this.registers[x] = Math.floor(Math.random() * 256) & kk;
        break;
      case 0xd000: // DRW Vx, Vy, nibble
        this.registers[0xf] = 0;
        for (let row = 0, height = n; row < height; row++) {
          const sprite = this.memory[this.i + row];
          for (let col = 0, width = 8; col < width; col++) {
            const value = sprite & (1 << (7 - col)) ? 1 : 0;
            if (value && this.display.togglePixel(this.registers[x] + col, this.registers[y] + row)) {
              this.registers[0xf] = 1;
            }
          }
        }
        break;
      case 0xe000:
        switch (kk) {
          case 0x9e:
            this.pc += this.keyboard.isKeyPressed(this.registers[x]) ? 2 : 0;
            break;
          case 0xa1:
            this.pc += this.keyboard.isKeyPressed(this.registers[x]) ? 0 : 2;
            break;
        }
        break;
      case 0xf000:
        switch (kk) {
          case 0x07: // LD Vx, DT
            this.registers[x] = this.dt;
            break;
          case 0x0a:
            // TODO
            break;
          case 0x15: // LD DT, Vx
            this.dt = this.registers[x];
            break;
          case 0x18: // LD ST, Vx
            this.st = this.registers[x];
            break;
          case 0x1e: // ADD I, Vx
            this.i += this.registers[x];
            break;
          case 0x29: // LD F, Vx
            this.i = this.registers[x] * 5;
            break;
          case 0x33: // LD B, Vx
            this.memory[this.i] = this.registers[x] / 100;
            this.memory[this.i + 1] = (this.registers[x] % 100) / 10;
            this.memory[this.i + 2] = this.registers[x] % 10;
            break;
          case 0x55: // LD [I], Vx
            for (let i = 0; i <= x; i++) {
              this.memory[this.i + i] = this.registers[i];
            }
            break;
          case 0x65: // LD Vx, [I]
            for (let i = 0; i <= x; i++) {
              this.registers[i] = this.memory[this.i + i];
            }
            break;
        }
        break;

      default:
        throw new Error(`Unknown opcode: ${opcode.toString(16).padStart(4, "0")}`);
    }
  }

  updateTimers() {
    if (this.dt > 0) {
      this.dt -= 1;
    }

    if (this.st > 0) {
      this.st -= 1;
    }
  }

  renderDisplay() {
    this.display.render();
  }

  playSound() {
    if (this.st > 0) {
      this.speaker.play();
    } else {
      this.speaker.stop();
    }
  }
}
