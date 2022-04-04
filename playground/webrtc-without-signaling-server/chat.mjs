// @ts-check

/**
 * @type {RTCIceServer[]}
 */
const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

/**
 * @typedef ChatOptions
 * @type {object}
 * @property {(s: string) => string} [compress] - Function used to compress the offer and answer.
 * @property {(s: string) => string} [decompress] - Function used to decompress the offer and answer.
 * @property {HTMLInputElement} videoCheckbox - Checkbox that indicates whether we're connected.
 * @property {HTMLVideoElement} videoOwn - Video element for own stream.
 * @property {HTMLVideoElement} videoPeer - Video element for peer strema.
 * @property {HTMLFormElement} form - Form.
 * @property {HTMLInputElement} offerInput - Input for offer.
 * @property {HTMLButtonElement} offerButton - Button to create offer.
 * @property {HTMLInputElement} answerInput - Input for answer.
 * @property {HTMLOutputElement} chatOutput - Output for chat.
 * @property {HTMLInputElement} chatInput - Input for chat.
 * @property {HTMLButtonElement} chatButton - Button to send chat message.
 */

export default class Chat {
  /**
   * @param {ChatOptions} options
   */
  constructor(options) {
    this.initOptions(options);
    this.initPeerConnection();
    this.initUi();

    this.offer = undefined;
    this.answer = undefined;

    // Calling this early to get a video stream ASAP.
    this.userMedia = this.getUserMedia();
  }

  /**
   * @param {ChatOptions} options
   */
  initOptions(options) {
    this.compress = options.compress ?? ((str) => str);
    this.decompress = options.decompress ?? ((str) => str);
    this.videoCheckbox = options.videoCheckbox;
    this.videoOwn = options.videoOwn;
    this.videoPeer = options.videoPeer;
    this.form = options.form;
    this.offerButton = options.offerButton;
    this.offerInput = options.offerInput;
    this.answerInput = options.answerInput;
    this.chatOutput = options.chatOutput;
    this.chatInput = options.chatInput;
    this.chatButton = options.chatButton;
  }

  initPeerConnection() {
    this.logDebug("Initializing peer connection");

    this.pc = new RTCPeerConnection({ iceServers });
    this.pc.ondatachannel = (evt) => {
      this.dc = evt.channel;
      this.initDataChannel();
    };
    this.pc.oniceconnectionstatechange = () => {
      this.logDebug(`Connection state is "${this.pc.iceConnectionState}"`);
    };
    this.pc.onsignalingstatechange = () => {
      this.logDebug(`Signaling state is "${this.pc.signalingState}"`);
    };
    this.pc.ontrack = (evt) => {
      this.videoPeer.srcObject = evt.streams[0];
    };
  }

  initDataChannel() {
    this.logDebug(`Initializing data channel "${this.dc.label}"`);

    this.dc.onopen = () => {
      this.logDebug("----------");
      this.updateUi();
    };
    this.dc.onmessage = (evt) => {
      this.logMessage(`Peer: ${evt.data}`);
    };
  }

  initUi() {
    this.offerInput.value = "";
    this.answerInput.value = "";
    this.chatInput.value = "";

    this.offerButton.onclick = () => {
      this.createOffer();
    };

    this.offerInput.oninput = () => {
      if (this.pc.signalingState !== "stable") {
        return;
      }

      this.processOffer();
    };

    this.answerInput.oninput = () => {
      if (this.pc.signalingState !== "have-local-offer") {
        return;
      }

      this.processAnswer();
    };

    this.form.onsubmit = (evt) => {
      evt.preventDefault();
      this.sendMessage();
    };

    this.updateUi();
  }

  updateUi() {
    this.offerInput.placeholder = !this.offer ? "Create or paste offer here" : "";
    this.offerInput.readOnly = !!this.offer;
    this.offerButton.disabled = !!this.offer;

    this.answerInput.placeholder = !!this.offer && !this.answer ? "Paste answer here" : "";
    this.answerInput.readOnly = !!this.offer && !!this.answer;
    this.answerInput.disabled = !this.offer;

    const isConnected = this.dc && this.dc.readyState === "open";
    this.chatInput.disabled = !isConnected;
    this.chatButton.disabled = !isConnected;
    this.videoCheckbox.checked = isConnected;
  }

  async getUserMedia() {
    this.logDebug("Getting user media");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        aspectRatio: { ideal: 16 / 9 },
        facingMode: { ideal: "user" },
      },
      audio: true,
    });

    this.videoOwn.srcObject = stream;
    stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, stream);
    });
  }

  async createOffer() {
    this.logDebug("Creating offer");

    this.dc = this.pc.createDataChannel("chat");
    this.initDataChannel();

    try {
      this.updateUi();

      await this.userMedia;

      const localDescription = await this.pc.createOffer();
      await this.pc.setLocalDescription(localDescription);
    } catch (err) {
      this.logError(err);
    } finally {
      this.updateUi();
    }

    this.pc.onicecandidate = (evt) => {
      if (evt.candidate) {
        return;
      }

      this.offer = this.pc.localDescription.sdp;
      console.debug("Offer", this.offer);
      this.logDebug("Compressing offer");
      const compressedOffer = this.compress(this.offer);

      this.offerInput.focus();
      this.offerInput.value = compressedOffer;
      this.offerInput.select();
      navigator.clipboard.writeText(compressedOffer);

      this.updateUi();
    };
  }

  async processOffer() {
    this.logDebug("Processing offer");

    try {
      this.updateUi();

      const compressedOffer = this.offerInput.value;
      this.logDebug("Decompressing offer");
      this.offer = this.decompress(compressedOffer);
      console.debug("Offer", this.offer);

      const remoteDescription = new RTCSessionDescription({ type: "offer", sdp: this.offer });
      await this.pc.setRemoteDescription(remoteDescription);

      const localDescription = await this.pc.createAnswer();
      await this.pc.setLocalDescription(localDescription);
    } catch (err) {
      this.logError(err);
    } finally {
      this.updateUi();
    }

    this.pc.onicecandidate = (evt) => {
      if (evt.candidate) {
        return;
      }

      this.answer = this.pc.localDescription.sdp;
      console.debug("Answer", this.answer);
      this.logDebug("Compressing answer");
      const compressedAnswer = this.compress(this.answer);

      this.answerInput.focus();
      this.answerInput.value = compressedAnswer;
      this.answerInput.select();
      navigator.clipboard.writeText(compressedAnswer);

      this.updateUi();
    };
  }

  async processAnswer() {
    this.logDebug("Processing answer");

    try {
      this.updateUi();

      const compressedAnswer = this.answerInput.value;
      this.logDebug("Decompressing answer");
      this.answer = this.decompress(compressedAnswer);
      console.debug("Answer", this.answer);

      const remoteDescription = new RTCSessionDescription({ type: "answer", sdp: this.answer });
      await this.pc.setRemoteDescription(remoteDescription);
    } catch (err) {
      this.logError(err);
    } finally {
      this.updateUi();
    }
  }

  sendMessage() {
    const msg = this.chatInput.value;
    this.dc.send(msg);
    this.logMessage(`You: ${msg}`);
    this.chatInput.focus();
    this.chatInput.value = "";
  }

  /**
   * @param {string} msg
   */
  logDebug(msg) {
    this.log(msg, { fontStyle: "italic" });
  }

  /**
   * @param {string} msg
   */
  logError(msg) {
    this.log(msg, { fontStyle: "italic", fontWeight: "bold" });
  }

  /**
   * @param {string} msg
   */
  logMessage(msg) {
    this.log(msg, { fontWeight: "bold" });
  }

  /**
   * @param {string} msg
   * @param {object} [style]
   */
  log(msg, style = {}) {
    const child = document.createElement("div");
    Object.keys(style).forEach((key) => {
      child.style[key] = style[key];
    });
    child.appendChild(document.createTextNode(msg));
    this.chatOutput.appendChild(child);
    this.chatOutput.scrollTop = this.chatOutput.scrollHeight;
  }
}
