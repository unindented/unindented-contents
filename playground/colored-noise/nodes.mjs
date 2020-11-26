/**
 * See https://noisehack.com/generate-noise-web-audio-api/
 */

export const createWhiteNoise = (audioContext) => {
  const bufferSize = 4096;

  const node = audioContext.createScriptProcessor(bufferSize, 1, 1);

  node.onaudioprocess = (evt) => {
    let output = evt.outputBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  };

  return node;
};

export const createPinkNoise = (audioContext) => {
  const bufferSize = 4096;

  let b0 = 0.0;
  let b1 = 0.0;
  let b2 = 0.0;
  let b3 = 0.0;
  let b4 = 0.0;
  let b5 = 0.0;
  let b6 = 0.0;

  const node = audioContext.createScriptProcessor(bufferSize, 1, 1);

  node.onaudioprocess = (evt) => {
    let output = evt.outputBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      output[i] *= 0.11; // (roughly) compensate for gain
    }
  };

  return node;
};

export const createRedNoise = (audioContext) => {
  const bufferSize = 4096;

  let lastOut = 0.0;

  const node = audioContext.createScriptProcessor(bufferSize, 1, 1);

  node.onaudioprocess = (evt) => {
    let output = evt.outputBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // (roughly) compensate for gain
    }
  };

  return node;
};

export const createGain = (audioContext) => {
  const node = audioContext.createGain();

  node.gain.value = 0.0;

  return node;
};

export const createAnalyzer = (audioContext) => {
  const node = audioContext.createAnalyser();

  node.fftSize = 256;
  node.minDecibels = -90;
  node.maxDecibels = 0;
  node.smoothingTimeConstant = 0.85;

  return node;
};
