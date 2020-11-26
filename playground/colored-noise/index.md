+++
title = "Colored Noise — White, Pink, and Red"
date = "2020-11-23"
tags = ["Audio"]
+++

Using the [Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API) to generate noise of different colors.
{.lead}

<!--more-->

{{< figure class="u-w-bleed relative" >}}
  <link rel="stylesheet" href="noise.css" />

  <canvas id="noise-visualization" class="absolute top-0 left-0 right-0 bottom-0 z-0 h-full w-full">
    Your browser doesn't support canvas.
  </canvas>

  <form id="noise-ranges" class="relative z-10 mx-4 flex flex-col gap-4 py-8 sm:mx-8">
    <label class="form-label-inline">
      <span class="w-20 font-semibold">White</span>
      <input id="noise-white" name="white" class="form-range w-full" type="range" value="0" min="0" max="2" step="0.01" />
    </label>
    <label class="form-label-inline">
      <span class="w-20 font-semibold">Pink</span>
      <input id="noise-pink" name="pink" class="form-range w-full" type="range" value="0.1" min="0" max="2" step="0.01" />
    </label>
    <label class="form-label-inline">
      <span class="w-20 font-semibold">Red</span>
      <input id="noise-red" name="red" class="form-range w-full" type="range" value="0" min="0" max="2" step="0.01" />
    </label>
  </form>
{{< /figure >}}

{{< script >}}
import NoiseMaker from "./noise.mjs";

const bodyStyle = getComputedStyle(document.body);
const articleStyle = getComputedStyle(document.querySelector("article"));

const noiseMaker = new NoiseMaker({
  canvas: document.getElementById("noise-visualization"),
  foregroundColor: articleStyle.getPropertyValue("background-color"),
  backgroundColor: bodyStyle.getPropertyValue("background-color"),
  gainValues: {
    white: parseFloat(document.getElementById("noise-white").value),
    pink: parseFloat(document.getElementById("noise-pink").value),
    red: parseFloat(document.getElementById("noise-red").value),
  },
});

document.getElementById("noise-ranges").addEventListener("input", (evt) => {
  noiseMaker.update({ [evt.target.name]: parseFloat(evt.target.value) });
});

noiseMaker.start();
{{< /script >}}

You can move the sliders to adjust the gain on the [white](https://en.wikipedia.org/wiki/White_noise), [pink](https://en.wikipedia.org/wiki/Pink_noise), and [red](https://en.wikipedia.org/wiki/Brownian_noise) noise generators.

Everything within the Web Audio API is based around the concept of an audio graph, which is made up of different types of nodes. This is what the graph for this tiny app looks like:

{{< figure class="u-w-bleed" >}}
  <div class="mx-4 sm:mx-8">
    {{< readfile "playground/colored-noise/graph.svg" >}}
  </div>
{{< /figure >}}
