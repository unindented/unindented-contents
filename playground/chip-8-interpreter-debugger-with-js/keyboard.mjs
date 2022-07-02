// @ts-check

/** @type {{[key: string]: number}} */
const keyMap = {
  Digit1: 0x1, // 1
  Digit2: 0x2, // 2
  Digit3: 0x3, // 3
  Digit4: 0xc, // 4
  KeyQ: 0x4, // Q
  KeyW: 0x5, // W
  KeyE: 0x6, // E
  KeyR: 0xd, // R
  KeyA: 0x7, // A
  KeyS: 0x8, // S
  KeyD: 0x9, // D
  KeyF: 0xe, // F
  KeyZ: 0xa, // Z
  KeyX: 0x0, // X
  KeyC: 0xb, // C
  KeyV: 0xf, // V
};

export default class Keyboard {
  constructor() {
    /** @type {{[code: number]: boolean}} */
    this.keysPressed = {};

    /** @type {((code: number) => void) | null} */
    this.onNextKeyPress = null;

    window.addEventListener("keydown", this.onKeyDown.bind(this), false);
    window.addEventListener("keyup", this.onKeyUp.bind(this), false);
  }

  /**
   * @param {number} keyCode
   */
  isKeyPressed(keyCode) {
    return !!this.keysPressed[keyCode];
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    const keyCode = keyMap[event.code];

    if (keyCode == null) {
      return;
    }

    this.keysPressed[keyCode] = true;

    if (this.onNextKeyPress) {
      this.onNextKeyPress(keyCode);
      this.onNextKeyPress = null;
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp(event) {
    const keyCode = keyMap[event.code];

    if (keyCode == null) {
      return;
    }

    this.keysPressed[keyCode] = false;
  }
}
