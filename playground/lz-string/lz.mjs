/**
 * @license lz-string 1.4.4
 *
 * Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * This source code is licensed under the MIT license.
 *
 * @see {@link http://pieroxy.net/blog/pages/lz-string/index.html}
 */

// @ts-check

const fromCharCode = String.fromCharCode;
const keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";

/**
 * @type {{[alphabet: string]: {[character: string]: number}}}
 */
const baseReverseDic = {};

/**
 * @param {string} alphabet
 * @param {string} character
 * @returns {number}
 */
function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (let i = 0; i < alphabet.length; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

/**
 * @param {string} input
 * @returns {string}
 */
export function compressToUTF16(input) {
  return _compress(input, 15, (a) => fromCharCode(a + 32)) + " ";
}

/**
 * @param {string} compressed
 * @returns {string}
 */
export function decompressFromUTF16(compressed) {
  return _decompress(compressed.length, 16384, (index) => compressed.charCodeAt(index) - 32);
}

/**
 * @param {string} input
 * @returns {string}
 */
export function compressToBase64(input) {
  const res = _compress(input, 6, (a) => keyStrBase64.charAt(a));
  switch (res.length % 4) {
    case 3:
      return res + "=";
    case 2:
      return res + "==";
    case 1:
      return res + "===";
    case 0:
    default:
      return res;
  }
}

/**
 * @param {string} input
 * @returns {string}
 */
export function decompressFromBase64(input) {
  return _decompress(input.length, 32, (index) => getBaseValue(keyStrBase64, input.charAt(index)));
}

/**
 * @param {string} input
 * @returns {string}
 */
export function compressToEncodedURIComponent(input) {
  return _compress(input, 6, (a) => keyStrUriSafe.charAt(a));
}

/**
 * @param {string} input
 * @returns {string}
 */
export function decompressFromEncodedURIComponent(input) {
  input = input.replace(/ /g, "+");
  return _decompress(input.length, 32, (index) => getBaseValue(keyStrUriSafe, input.charAt(index)));
}

/**
 * @param {string} uncompressed
 * @returns {Uint8Array}
 */
export function compressToUint8Array(uncompressed) {
  const compressed = compress(uncompressed);
  const buf = new Uint8Array(compressed.length * 2);
  for (let i = 0, l = compressed.length; i < l; i++) {
    const current_value = compressed.charCodeAt(i);
    buf[i * 2] = current_value >>> 8;
    buf[i * 2 + 1] = current_value % 256;
  }
  return buf;
}

/**
 * @param {Uint8Array} compressed
 * @returns {string}
 */
export function decompressFromUint8Array(compressed) {
  const buf = new Array(compressed.length / 2);
  for (let i = 0, l = buf.length; i < l; i++) {
    buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
  }
  return decompress(buf.map((c) => fromCharCode(c)).join(""));
}

/**
 * @param {string} uncompressed
 * @returns {string}
 */
export function compress(uncompressed) {
  return _compress(uncompressed, 16, (a) => fromCharCode(a));
}

/**
 * @param {string} compressed
 * @returns {string}
 */
export function decompress(compressed) {
  return _decompress(compressed.length, 32768, (index) => compressed.charCodeAt(index));
}

/**
 * @param {string} uncompressed
 * @param {number} bitsPerChar
 * @param {(a: number) => string} getCharFromInt
 * @returns {string}
 */
function _compress(uncompressed, bitsPerChar, getCharFromInt) {
  /** @type {number} */
  let value;

  /** @type {{[c: string]: number}} */
  const context_dictionary = {};
  /** @type {{[c: string]: boolean}} */
  const context_dictionaryToCreate = {};
  /** @type {string[]} */
  const context_data = [];

  let context_w = "";
  let context_c = "";
  let context_wc = "";

  let context_enlargeIn = 2;
  let context_dictSize = 3;
  let context_numBits = 2;

  let context_data_val = 0;
  let context_data_position = 0;

  for (let ii = 0; ii < uncompressed.length; ii += 1) {
    context_c = uncompressed.charAt(ii);
    if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
      context_dictionary[context_c] = context_dictSize++;
      context_dictionaryToCreate[context_c] = true;
    }

    context_wc = context_w + context_c;
    if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
      context_w = context_wc;
    } else {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
        if (context_w.charCodeAt(0) < 256) {
          for (let i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (let i = 0; i < 8; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (let i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (let i = 0; i < 16; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (let i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
      context_dictionary[context_wc] = context_dictSize++;
      context_w = String(context_c);
    }
  }

  if (context_w !== "") {
    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
      if (context_w.charCodeAt(0) < 256) {
        for (let i = 0; i < context_numBits; i++) {
          context_data_val = context_data_val << 1;
          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
        }
        value = context_w.charCodeAt(0);
        for (let i = 0; i < 8; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      } else {
        value = 1;
        for (let i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | value;
          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = 0;
        }
        value = context_w.charCodeAt(0);
        for (let i = 0; i < 16; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
      delete context_dictionaryToCreate[context_w];
    } else {
      value = context_dictionary[context_w];
      for (let i = 0; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value & 1);
        if (context_data_position == bitsPerChar - 1) {
          context_data_position = 0;
          context_data.push(getCharFromInt(context_data_val));
          context_data_val = 0;
        } else {
          context_data_position++;
        }
        value = value >> 1;
      }
    }
    context_enlargeIn--;
    if (context_enlargeIn == 0) {
      context_enlargeIn = Math.pow(2, context_numBits);
      context_numBits++;
    }
  }

  value = 2;
  for (let i = 0; i < context_numBits; i++) {
    context_data_val = (context_data_val << 1) | (value & 1);
    if (context_data_position == bitsPerChar - 1) {
      context_data_position = 0;
      context_data.push(getCharFromInt(context_data_val));
      context_data_val = 0;
    } else {
      context_data_position++;
    }
    value = value >> 1;
  }

  while (true) {
    context_data_val = context_data_val << 1;
    if (context_data_position == bitsPerChar - 1) {
      context_data.push(getCharFromInt(context_data_val));
      break;
    } else {
      context_data_position++;
    }
  }

  return context_data.join("");
}

/**
 * @param {number} length
 * @param {number} resetValue
 * @param {(index: number) => number} getNextValue
 * @returns {string}
 */
function _decompress(length, resetValue, getNextValue) {
  /** @type {(number | string)[]} */
  const result = [];
  /** @type {(number | string)[]} */
  const dictionary = [];
  /** @type {{val: number, position: number, index: number}} */
  const data = { val: getNextValue(0), position: resetValue, index: 1 };

  /** @type {number | string} */
  let w;
  /** @type {number | string} */
  let c;

  let bits = 0;
  let maxPower = Math.pow(2, 2);
  let power = 1;
  let resb = 0;

  while (power != maxPower) {
    resb = data.val & data.position;
    data.position >>= 1;
    if (data.position == 0) {
      data.position = resetValue;
      data.val = getNextValue(data.index++);
    }
    bits |= (resb > 0 ? 1 : 0) * power;
    power <<= 1;
  }

  switch (bits) {
    case 0:
      bits = 0;
      maxPower = Math.pow(2, 8);
      power = 1;
      while (power != maxPower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      c = fromCharCode(bits);
      break;
    case 1:
      bits = 0;
      maxPower = Math.pow(2, 16);
      power = 1;
      while (power != maxPower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      c = fromCharCode(bits);
      break;
    case 2:
      return "";
  }

  for (let i = 0; i < 3; i += 1) {
    dictionary[i] = i;
  }

  dictionary[3] = c;
  w = c;
  result.push(c);

  let enlargeIn = 4;
  let dictSize = 4;
  let numBits = 3;

  while (true) {
    if (data.index > length) {
      return "";
    }

    bits = 0;
    maxPower = Math.pow(2, numBits);
    power = 1;

    while (power != maxPower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch ((c = bits)) {
      case 0:
        bits = 0;
        maxPower = Math.pow(2, 8);
        power = 1;
        while (power != maxPower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        dictionary[dictSize++] = fromCharCode(bits);
        c = dictSize - 1;
        enlargeIn--;
        break;
      case 1:
        bits = 0;
        maxPower = Math.pow(2, 16);
        power = 1;
        while (power != maxPower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        dictionary[dictSize++] = fromCharCode(bits);
        c = dictSize - 1;
        enlargeIn--;
        break;
      case 2:
        return result.join("");
    }

    if (enlargeIn == 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }

    let entry;

    if (dictionary[c]) {
      entry = dictionary[c];
    } else {
      if (c === dictSize) {
        entry = w + w.charAt(0);
      } else {
        return null;
      }
    }
    result.push(entry);

    dictionary[dictSize++] = w + entry.charAt(0);
    enlargeIn--;

    w = entry;

    if (enlargeIn == 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }
  }
}
