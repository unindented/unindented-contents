// @ts-check

const utterableChars = /** @type {const} */ ("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const utterableAltSamples = /** @type {const} */ (["b-abcd", "b-letters"]);
const utterableAltChance = 0.05;

const samples = /** @type {const} */ ([
  "a-what",
  "b-abcd",
  "b-baby-smash",
  "b-baby",
  "b-bunny",
  "b-cat",
  "b-dog",
  "b-eheh",
  "b-foo-foo",
  "b-funny",
  "b-haha",
  "b-hahah",
  "b-happy-baby",
  "b-heh",
  "b-hehe",
  "b-letters",
  "b-like-that",
  "b-like-this",
  "b-look-at-that",
  "b-meow-meow",
  "b-meow",
  "b-monkey",
  "b-monkeys",
  "b-more",
  "b-no-more",
  "b-panda",
  "b-perrito",
  "b-play-ball",
  "b-see-more",
  "b-there",
  "b-tigers",
  "b-tiggers",
  "b-twinkle-twinkle",
  "b-wof-woof",
  "b-wyatt-ball",
  "b-wyatt",
  "b-yay",
]);

/**
 * @typedef {typeof samples} Samples
 * @typedef {Samples[number]} Sample
 * @typedef {Record<Sample, AudioBuffer>} SampleToAudioBuffer
 */

const emojis = /** @type {const} */ ([
  "⚾️",
  "⭐️",
  "🎾",
  "🐨",
  "🐯",
  "🐰",
  "🐱",
  "🐵",
  "🐶",
  "🐹",
  "🐼",
  "👦",
  "👧",
  "👶",
  "🤣",
  "🧒",
  "😀",
  "😁",
  "😂",
  "😃",
  "😄",
  "😅",
  "😆",
  "😇",
  "😉",
  "😊",
  "😸",
  "😹",
  "😺",
  "🙂",
  "🙃",
  "🙈",
  "🙉",
  "🙊",
]);

/**
 * @typedef {typeof emojis} Emojis
 * @typedef {Emojis[number]} Emoji
 * @typedef {Record<Emoji, readonly Sample[]>} EmojiToSamples
 */

/** @type {EmojiToSamples} */
const emojiToSamples = {
  "⚾️": ["b-play-ball", "b-wyatt-ball"],
  "⭐️": ["b-twinkle-twinkle"],
  "🎾": ["b-play-ball", "b-wyatt-ball"],
  "🐨": ["a-what", "b-look-at-that", "b-there"],
  "🐯": ["b-tigers", "b-tiggers"],
  "🐰": ["b-bunny", "b-foo-foo"],
  "🐱": ["b-cat", "b-meow", "b-meow-meow"],
  "🐵": ["b-monkey", "b-monkeys", "b-see-more"],
  "🐶": ["b-dog", "b-perrito", "b-wof-woof"],
  "🐹": ["a-what", "b-look-at-that"],
  "🐼": ["b-panda"],
  "👦": ["b-baby", "b-happy-baby", "b-wyatt"],
  "👧": ["b-baby", "b-happy-baby"],
  "👶": ["b-baby", "b-happy-baby", "b-yay"],
  "🤣": ["b-funny", "b-haha", "b-hahah"],
  "🧒": ["b-baby", "b-happy-baby"],
  "😀": ["b-eheh", "b-heh", "b-hehe"],
  "😁": ["b-eheh", "b-heh", "b-hehe"],
  "😂": ["b-funny", "b-haha", "b-hahah"],
  "😃": ["b-eheh", "b-funny", "b-heh", "b-hehe"],
  "😄": ["b-haha", "b-hahah"],
  "😅": ["b-haha", "b-hahah"],
  "😆": ["b-haha", "b-hahah"],
  "😇": ["b-eheh", "b-look-at-that", "b-more"],
  "😉": ["b-eheh", "b-look-at-that", "b-more"],
  "😊": ["b-happy-baby", "b-more", "b-yay"],
  "😸": ["b-cat", "b-meow", "b-meow-meow"],
  "😹": ["b-cat", "b-meow", "b-meow-meow"],
  "😺": ["b-cat", "b-meow", "b-meow-meow"],
  "🙂": ["b-happy-baby", "b-like-this"],
  "🙃": ["a-what", "b-look-at-that", "b-like-that"],
  "🙈": ["b-monkey", "b-monkeys", "b-no-more"],
  "🙉": ["b-monkey", "b-monkeys", "b-no-more"],
  "🙊": ["b-monkey", "b-monkeys", "b-no-more"],
};

/**
 * @template T
 * @param {readonly T[]} array
 * @returns {T}
 */
const random = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

/**
 * @typedef {object} Options
 * @property {HTMLElement} container
 * @property {HTMLDivElement} dummy
 * @property {HTMLButtonElement} button
 */

export default class BabySmash {
  /**
   * @param {Options} options
   */
  constructor(options) {
    /** @type {HTMLElement} */
    this.container = options.container;
    /** @type {HTMLDivElement} */
    this.dummy = options.dummy;
    /** @type {HTMLButtonElement} */
    this.button = options.button;

    this.init = this.init.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onResize = this.onResize.bind(this);

    this.container.addEventListener("fullscreenchange", this.onFullscreenChange);
    this.container.addEventListener("mozfullscreenchange", this.onFullscreenChange);
    this.container.addEventListener("webkitfullscreenchange", this.onFullscreenChange);

    this.button.addEventListener("click", this.init);

    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  /**
   * @return {Promise<void>}
   */
  async init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext;
      this.audioCtx = new AudioContext();
    }

    if (!this.sampleToAudioBuffer) {
      this.sampleToAudioBuffer = await this.loadSamples(samples);
    }

    const requestFullscreen =
      this.container.requestFullscreen ||
      this.container["mozRequestFullscreen"] ||
      this.container["webkitRequestFullscreen"];

    if (requestFullscreen) {
      requestFullscreen.call(this.container);
    } else {
      this.start();
    }
  }

  /**
   * @return {void}
   */
  start() {
    this.button.style.cssText = "display: none";
    this.container.addEventListener("click", this.onClick);
    this.container.addEventListener("keydown", this.onKeyDown);
    this.container.focus();

    this.playSample("b-baby-smash");
  }

  /**
   * @return {void}
   */
  end() {
    this.button.style.cssText = "";
    this.container.removeEventListener("click", this.onClick);
    this.container.removeEventListener("keydown", this.onKeyDown);
    this.container.blur();
  }

  /**
   * @return {void}
   */
  onFullscreenChange() {
    this.onResize();

    if (document.fullscreenElement || document["mozFullscreenElement"] || document["webkitFullscreenElement"]) {
      this.start();
    } else {
      this.end();
    }
  }

  /**
   * @return {void}
   */
  onClick() {
    const renderableChar = random(emojis);
    this.renderChar(renderableChar);
    this.playChar(renderableChar);
  }

  /**
   * @param {KeyboardEvent} evt
   * @return {void}
   */
  onKeyDown(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const { key } = evt;
    const isUtterableChar = utterableChars.includes(key);
    const utterableChar = isUtterableChar ? key.toLowerCase() : undefined;
    const renderableChar = isUtterableChar ? key.toUpperCase() : random(emojis);

    window.speechSynthesis.cancel();

    this.renderChar(renderableChar);
    this.playChar(renderableChar, utterableChar);
  }

  /**
   * @return {void}
   */
  onResize() {
    this.containerRect = this.container.getBoundingClientRect();
    this.fontSize = Math.round(Math.sqrt(this.containerRect.width * this.containerRect.height) / 5);
  }

  /**
   * @param {Samples} samples
   * @return {Promise<SampleToAudioBuffer>}
   */
  async loadSamples(samples) {
    const audioBuffers = await Promise.all(
      samples.map(async (sample) => {
        const response = await fetch(`audio/${sample}.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        return { sample, audioBuffer };
      })
    );

    return audioBuffers.reduce((acc, { sample, audioBuffer }) => {
      acc[sample] = audioBuffer;
      return acc;
    }, /** @type {SampleToAudioBuffer} */ ({}));
  }

  /**
   * @param {Sample} sample
   * @return {void}
   */
  playSample(sample) {
    const sampleSource = this.audioCtx.createBufferSource();
    sampleSource.buffer = this.sampleToAudioBuffer[sample];
    sampleSource.connect(this.audioCtx.destination);
    sampleSource.start();
  }

  /**
   * @param {readonly Sample[]} samples
   * @return {void}
   */
  playRandomSample(samples) {
    this.playSample(random(samples));
  }

  /**
   * @param {string} renderableChar
   * @param {string} [utterableChar]
   * @return {void}
   */
  playChar(renderableChar, utterableChar) {
    if (utterableChar == null) {
      this.playRandomSample(emojiToSamples[renderableChar]);
    } else if (Math.random() < utterableAltChance) {
      this.playRandomSample(utterableAltSamples);
    } else {
      const speechUtterance = new SpeechSynthesisUtterance();
      speechUtterance.text = utterableChar;
      window.speechSynthesis.speak(speechUtterance);
    }
  }

  /**
   * @param {string} renderableChar
   * @return {void}
   */
  renderChar(renderableChar) {
    const div = /** @type {HTMLDivElement} */ (this.dummy.cloneNode());
    delete div.id;

    div.style.fontSize = `${this.fontSize}px`;
    div.textContent = renderableChar;
    div.addEventListener("animationend", () => {
      this.container.removeChild(div);
    });
    this.container.appendChild(div);

    const divRect = div.getBoundingClientRect();
    const divLeft = Math.round(Math.random() * (this.containerRect.width - divRect.width));
    const divTop = Math.round(Math.random() * (this.containerRect.height - divRect.height));

    div.style.left = `${divLeft}px`;
    div.style.top = `${divTop}px`;
  }
}
