+++
title = "Touch Grid"
date = "2014-02-22"
tags = ["Canvas"]
+++

Straightforward experiment with a canvas displaying some circles. Move your mouse or fingers over the circles, and they will react.

<!--more-->

<figure class="full-width-wrapper">
  <canvas id="grid-target">
    Your browser does not support canvas.
  </canvas>
</figure>

{{< script >}}
import TouchGrid from "./grid.mjs";

const palette = getComputedStyle(document.documentElement);

new TouchGrid(document.getElementById("grid-target"), {
  width: 600,
  height: 360,
  colors: [
    palette.getPropertyValue('--color-red-60'),
    palette.getPropertyValue('--color-magenta-60'),
    palette.getPropertyValue('--color-purple-60'),
    palette.getPropertyValue('--color-indigo-60'),
    palette.getPropertyValue('--color-blue-60'),
    palette.getPropertyValue('--color-sky-60'),
    palette.getPropertyValue('--color-teal-60'),
    palette.getPropertyValue('--color-green-60'),
    palette.getPropertyValue('--color-bronze-60'),
    palette.getPropertyValue('--color-slate-60'),
    palette.getPropertyValue('--color-dusk-60'),
    palette.getPropertyValue('--color-gray-60'),
  ]
});
{{< /script >}}

I wanted to keep the experiment simple and dependency-free, so it's only listening to [`mousemove`](https://developer.mozilla.org/docs/Web/API/Element/mousemove_event) and [`touchmove`](https://developer.mozilla.org/docs/Web/API/Document/touchmove_event) events. This means that it doesn't have full touch and pen support on Internet Explorer. Microsoft's proposal for [pointer events](https://www.w3.org/TR/pointerevents/) is on its way to becoming a standard (at the time of writing), so one day we may be able to forget about mouse, touch and pen events, and just deal with a single type.

If I didn't mind another external dependency, I would have gone with a polyfill like [Hand.js](https://github.com/Deltakosh/handjs), which adds pointer event support to every browser.
