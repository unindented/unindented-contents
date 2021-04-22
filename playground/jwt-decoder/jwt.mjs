// @ts-check

/**
 * @param {string} str
 */
const base64Decode = (str) =>
  decodeURIComponent(
    atob(str).replace(/(.)/g, (_m, c) => {
      let code = c.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = "0" + code;
      }
      return "%" + code;
    })
  );

/**
 * @param {string} str
 */
const base64UrlDecode = (str) => {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("Illegal Base64URL string!");
  }

  try {
    return base64Decode(output);
  } catch {
    return atob(output);
  }
};

/**
 * @param {string} token
 * @returns {any}
 */
export const decode = (token, { header = false } = {}) => {
  const pos = header === true ? 0 : 1;
  try {
    return JSON.parse(base64UrlDecode(token.split(".")[pos]));
  } catch {
    return {};
  }
};
