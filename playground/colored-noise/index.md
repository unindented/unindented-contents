+++
title = "Colored Noise"
date = "2020-11-23"
tags = ["Audio"]
+++

Using the [Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API) to generate noise of different colors. You can move the sliders to adjust the gain on the [white](https://en.wikipedia.org/wiki/White_noise), [pink](https://en.wikipedia.org/wiki/Pink_noise) and [red](https://en.wikipedia.org/wiki/Brownian_noise) noise generators.

<!--more-->

<figure class="content-width-wrapper">
  <link rel="stylesheet" href="noise.css" />

  <canvas id="visualization" class="visualization">
    Your browser does not support canvas.
  </canvas>

  <div id="ranges" class="ranges">
    <label for="white" class="range-label">White</label>
    <input id="white" name="white" class="range-input" type="range" value="0" min="0" max="2" step="0.01" />
    <label for="pink" class="range-label">Pink</label>
    <input id="pink" name="pink" class="range-input" type="range" value="0.1" min="0" max="2" step="0.01" />
    <label for="red" class="range-label">Red</label>
    <input id="red" name="red" class="range-input" type="range" value="0" min="0" max="2" step="0.01" />
  </div>
</figure>

{{< script >}}
import NoiseMaker from "./noise.mjs";

const palette = getComputedStyle(document.documentElement);

const noiseMaker = new NoiseMaker({
  canvas: document.getElementById("visualization"),
  foregroundColor: palette.getPropertyValue("--color-background"),
  backgroundColor: palette.getPropertyValue("--color-subtle-background"),
  gainValues: {
    white: parseFloat(document.getElementById("white").value),
    pink: parseFloat(document.getElementById("pink").value),
    red: parseFloat(document.getElementById("red").value),
  },
});

document.getElementById("ranges").addEventListener("input", (evt) => {
  noiseMaker.update({ [evt.target.name]: parseFloat(evt.target.value) });
});

noiseMaker.start();
{{< /script >}}

Everything within the Web Audio API is based around the concept of an audio graph, which is made up of different types of nodes. This is what the graph for this tiny app looks like:

<figure class="content-width-wrapper">
  {{< readfile "playground/colored-noise/graph.svg" >}}
</figure>
