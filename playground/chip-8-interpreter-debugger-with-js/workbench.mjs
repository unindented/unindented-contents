// @ts-check

import CPU from "./cpu.mjs";
import Display from "./display.mjs";
import Keyboard from "./keyboard.mjs";
import Speaker from "./speaker.mjs";
import { html, render } from "./lit-html/lit-html.mjs";
import { ref } from "./lit-html/directives/ref.mjs";

const fps = 60;
const fpsInterval = 1000 / fps;

export default class Workbench {
  /**
   * @param {HTMLElement} target
   */
  constructor(target) {
    /** @type {HTMLElement} */
    this.target = target;

    /** @type {Display} */
    this.display = new Display();
    /** @type {Keyboard} */
    this.keyboard = new Keyboard();
    /** @type {Speaker} */
    this.speaker = new Speaker();

    /** @type {CPU} */
    this.cpu = new CPU({
      display: this.display,
      keyboard: this.keyboard,
      speaker: this.speaker,
    });

    /** @type {DOMHighResTimeStamp} */
    this.previousTimestamp = 0;

    this.loadRom = this.loadRom.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.step = this.step.bind(this);
    this.onRefCanvas = this.onRefCanvas.bind(this);

    this.fetchRom("trip8");
  }

  async fetchRom(name) {
    const response = await fetch(`roms/${name}.ch8`);
    const buffer = await response.arrayBuffer();

    this.pause();
    this.cpu.load(new Uint8Array(buffer));
    this.render();
  }

  /**
   * @param {Event} event
   */
  loadRom(event) {
    const input = /** @type {HTMLInputElement} */ (event.target);
    const [file] = input.files ?? [];
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = /** @type {ArrayBuffer} */ (reader.result);

      this.pause();
      this.cpu.load(new Uint8Array(buffer));
      this.render();
    };

    reader.onerror = () => {
      console.error(reader.error);
    };

    reader.readAsArrayBuffer(file);
  }

  /**
   * @param {DOMHighResTimeStamp} timestamp
   */
  start(timestamp) {
    const elapsed = timestamp - this.previousTimestamp;

    if (elapsed > fpsInterval) {
      this.previousTimestamp = timestamp;
      this.step();
    }

    this.requestId = requestAnimationFrame(this.start);
  }

  pause() {
    if (!this.requestId) {
      return;
    }

    cancelAnimationFrame(this.requestId);
  }

  step() {
    this.cpu.step();
    this.render();
  }

  render() {
    const workbench = html`
      <div class="not-prose flex flex-row gap-4 font-mono text-base">
        <div class="flex grow-[1] flex-col gap-4">
          ${this.renderRegisters()} 
          ${this.renderStack()}
        </div>
        <div class="flex grow-[2] flex-col gap-4">
          <div class="flex flex-row gap-4">
            ${this.renderKeyboard()} 
            ${this.renderDisplay()}
          </div>
          ${this.renderDebugger()} 
          ${this.renderMemory()}
        </div>
      </div>
    `;

    render(workbench, this.target);
  }

  renderRegisters() {
    return html`
    <table class="divide-y border">
      <thead>
        <tr>
          <th scope="col" colspan="4" class="p-2">Registers</th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr class="divide-x">
          ${this.renderRegister("PC", 16, this.cpu.pc)}
          ${this.renderRegister("I", 16, this.cpu.i)}
          ${this.renderRegister("DT", 8, this.cpu.dt)}
          ${this.renderRegister("ST", 8, this.cpu.st)}
        </tr>
        <tr class="divide-x">
          ${this.renderRegister("V0", 8, this.cpu.registers[0x0])}
          ${this.renderRegister("V1", 8, this.cpu.registers[0x1])}
          ${this.renderRegister("V2", 8, this.cpu.registers[0x2])}
          ${this.renderRegister("V3", 8, this.cpu.registers[0x3])}
        </tr>
        <tr class="divide-x">
          ${this.renderRegister("V4", 8, this.cpu.registers[0x4])}
          ${this.renderRegister("V5", 8, this.cpu.registers[0x5])}
          ${this.renderRegister("V6", 8, this.cpu.registers[0x6])}
          ${this.renderRegister("V7", 8, this.cpu.registers[0x7])}
        </tr>
        <tr class="divide-x">
          ${this.renderRegister("V8", 8, this.cpu.registers[0x8])}
          ${this.renderRegister("V9", 8, this.cpu.registers[0x9])}
          ${this.renderRegister("VA", 8, this.cpu.registers[0xa])}
          ${this.renderRegister("VB", 8, this.cpu.registers[0xb])}
        </tr>
        <tr class="divide-x">
          ${this.renderRegister("VC", 8, this.cpu.registers[0xc])}
          ${this.renderRegister("VD", 8, this.cpu.registers[0xd])}
          ${this.renderRegister("VE", 8, this.cpu.registers[0xe])}
          ${this.renderRegister("VF", 8, this.cpu.registers[0xf])}
        </tr>
      </div>
    `;
  }

  /**
   * @param {string} name
   * @param {number} value
   */
  renderRegister(name, size, value) {
    return html`
      <td class="w-1/4 text-right">
        <div class="bg-gray-200 px-2 text-center font-bold dark:bg-gray-900">${name}</div>
        <div class="px-2 text-right">${value}</div>
        <div class="px-2 text-right">0x${value.toString(16).padStart(size / 4, "0")}</div>
      </td>
    `;
  }

  renderStack() {
    return html`
      <table class="divide-y border">
        <thead>
          <tr>
            <th scope="col" colspan="3" class="p-2">Stack</th>
          </tr>
        </thead>
        <tbody>
          ${[...this.cpu.stack].map((value, index) => this.renderStackEntry(index, 16, value))}
        </tbody>
      </table>
    `;
  }

  /**
   * @param {number} value
   * @param {number} index
   */
  renderStackEntry(index, size, value) {
    const isCurrent = this.cpu.sp === index;
    const classNames = isCurrent ? "bg-gray-200 dark:bg-gray-700" : "";
    return html`
      <tr class="${classNames} divide-x">
        <td class="w-1/6 px-2 text-right">0x${index.toString(16).padStart(2, "0")}</td>
        <td class="w-1/3 px-2 text-right">${value}</td>
        <td class="w-1/3 px-2 text-right">0x${value.toString(16).padStart(size / 4, "0")}</td>
      </tr>
    `;
  }

  renderKeyboard() {
    return html`
      <table class="grow-[1] divide-y border">
        <thead>
          <tr>
            <th scope="col" colspan="4" class="p-2">Keyboard</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr class="divide-x">
            ${this.renderKey("1", 0x1)}
            ${this.renderKey("2", 0x2)}
            ${this.renderKey("3", 0x3)}
            ${this.renderKey("C", 0xc)}
          </tr>
          <tr class="divide-x">
            ${this.renderKey("4", 0x4)}
            ${this.renderKey("5", 0x5)}
            ${this.renderKey("6", 0x6)}
            ${this.renderKey("D", 0xd)}
          </tr>
          <tr class="divide-x">
            ${this.renderKey("7", 0x7)}
            ${this.renderKey("8", 0x8)}
            ${this.renderKey("9", 0x9)}
            ${this.renderKey("E", 0xe)}
          </tr>
          <tr class="divide-x">
            ${this.renderKey("A", 0xa)}
            ${this.renderKey("0", 0x0)}
            ${this.renderKey("B", 0xb)}
            ${this.renderKey("F", 0xf)}
          </tr>
        </tbody>
      </table>
    `;
  }

  renderKey(name, code) {
    const isKeyPressed = this.keyboard.isKeyPressed(code);
    const classNames = isKeyPressed ? "bg-gray-200 dark:bg-gray-700" : "";
    return html`<td class="${classNames} w-1/4 py-4 text-center">${name}</td>`;
  }

  renderDisplay() {
    return html`
      <table class="divide-y border">
        <thead>
          <tr>
            <th scope="col" class="p-2">Display</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border">
              <canvas class="aspect-[2/1] w-[600px]" ${ref(this.onRefCanvas)}></canvas>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }

  renderDebugger() {
    return html`
      <table class="border">
        <tbody>
          <tr>
            <td class="flex justify-between p-2">
              <span class="relative overflow-hidden">
                <button type="button" class="bg-gray-200 p-2 dark:bg-gray-700">Load ROM</button>
                <input type="file" class="absolute top-0 right-0 bottom-0 left-0 opacity-0" @change=${this.loadRom} />
              </span>
              <div>
                <button type="button" class="bg-gray-200 p-2 dark:bg-gray-700" @click=${this.start}>Start</button>
                <button type="button" class="bg-gray-200 p-2 dark:bg-gray-700" @click=${this.pause}>Pause</button>
                <button type="button" class="bg-gray-200 p-2 dark:bg-gray-700" @click=${this.step}>Step</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }

  renderMemory() {
    const { memory } = this.cpu;
    const blockSize = 16;
    const lines = [];

    for (let i = 0, l = memory.length; i < l; i += blockSize) {
      const block = memory.slice(i, Math.min(i + blockSize, memory.length));

      const addr = i.toString(16).padStart(4, "0");

      let bytes = [...block].map((b) => b.toString(16).padStart(2, "0")).join(" ");
      bytes += "   ".repeat(blockSize - block.length);

      let chars = [...block].map((b) => (b > 0x1f && b < 0x7f ? String.fromCharCode(b) : ".")).join("");
      chars += " ".repeat(blockSize - block.length);

      lines.push([addr, bytes, chars]);
    }

    return html`
      <table class="divide-y border">
        <thead>
          <tr>
            <th scope="col" colspan="3" class="p-2">Memory</th>
          </tr>
        </thead>
        <tbody class="block max-h-[26rem] w-full overflow-y-auto">
          ${lines.map((line) => this.renderMemoryEntry(...line))}
        </tbody>
      </table>
    `;
  }

  renderMemoryEntry(addr, bytes, chars) {
    return html`
      <tr class="divide-x">
        <td class="w-1/6 px-2 text-right">0x${addr}</td>
        <td class="w-2/3 px-2 text-center">${bytes}</td>
        <td class="px-2 text-left">${chars}</td>
      </tr>
    `;
  }

  onRefCanvas(canvas) {
    requestAnimationFrame(() => {
      this.display.setCanvas(canvas);
    });
  }
}
