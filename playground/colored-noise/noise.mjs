import { createWhiteNoise, createPinkNoise, createRedNoise, createGain, createAnalyzer } from "./nodes.mjs";

const defaults = {
  foregroundColor: "#333",
  backgroundColor: "#666",

  gainValues: {
    white: 0.0,
    pink: 0.0,
    red: 0.0,
  },
};

export default class NoiseMaker {
  constructor(options) {
    this.initOptions(Object.assign({}, defaults, options));
    this.initCanvas();
    this.initAudio();
  }

  start() {
    this.connectAudioNodes();
    this.update();
    this.draw();
  }

  update(gainValues) {
    Object.assign(this.gainValues, gainValues);

    for (const type in this.gainValues) {
      const gainValue = this.gainValues[type];
      const gainNode = this.gainNodes[type];

      gainNode.gain.value = gainValue;
    }

    if (this.isSilent()) {
      this.suspend();
    } else {
      this.resume();
    }
  }

  suspend() {
    this.suspendRequest = window.setTimeout(() => {
      this.audioContext.suspend();
      this.isSuspended = true;
    }, 1000);
  }

  resume() {
    this.suspendRequest = window.clearTimeout(this.suspendRequest);

    if (!this.isSuspended) {
      return;
    }

    this.audioContext.resume();
    this.isSuspended = false;

    this.draw();
  }

  draw() {
    const bufferLength = this.analyzerNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barGap = 1;
    const barWidth = this.canvas.width / bufferLength - barGap;

    const drawStep = () => {
      if (!this.isSuspended) {
        window.requestAnimationFrame(drawStep);
      }

      this.analyzerNode.getByteFrequencyData(dataArray);

      this.canvasContext.fillStyle = this.backgroundColor;
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * this.canvas.height;

        this.canvasContext.fillStyle = this.foregroundColor;
        this.canvasContext.fillRect(i * (barWidth + barGap), this.canvas.height - barHeight, barWidth, barHeight);
      }
    };

    drawStep();
  }

  initOptions(options) {
    this.canvas = options.canvas;
    this.foregroundColor = options.foregroundColor;
    this.backgroundColor = options.backgroundColor;
    this.gainValues = options.gainValues;
  }

  initCanvas() {
    this.canvasContext = this.canvas.getContext("2d");

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  initAudio() {
    this.audioContext = new window.AudioContext();

    this.noiseNodes = {
      white: createWhiteNoise(this.audioContext),
      pink: createPinkNoise(this.audioContext),
      red: createRedNoise(this.audioContext),
    };
    this.gainNodes = {
      white: createGain(this.audioContext),
      pink: createGain(this.audioContext),
      red: createGain(this.audioContext),
    };
    this.analyzerNode = createAnalyzer(this.audioContext);
  }

  connectAudioNodes() {
    for (const type in this.noiseNodes) {
      const noiseNode = this.noiseNodes[type];
      const gainNode = this.gainNodes[type];

      noiseNode.connect(gainNode);
      gainNode.connect(this.analyzerNode);
    }

    this.analyzerNode.connect(this.audioContext.destination);
  }

  isSilent() {
    return Object.values(this.gainValues).reduce((acc, value) => acc + value, 0) === 0;
  }
}
