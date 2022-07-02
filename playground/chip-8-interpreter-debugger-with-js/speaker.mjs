// @ts-check

export default class Speaker {
  constructor() {
    /** @type {AudioContext} */
    this.context = new AudioContext();

    /** @type {OscillatorNode} */
    this.oscillator = this.context.createOscillator();
    this.oscillator.type = "square";

    /** @type {GainNode} */
    this.gain = this.context.createGain();

    this.oscillator.connect(this.gain);
    this.gain.connect(this.context.destination);
  }

  /**
   * @param {number} frequency
   */
  play(frequency = 440) {
    this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    // this.oscillator.start();
  }

  stop() {
    // this.oscillator.stop();
  }
}
