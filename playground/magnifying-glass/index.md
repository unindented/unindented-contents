+++
title = "Magnifying Glass"
date = "2014-04-07"
tags = ["Canvas", "Pixel Art"]
+++

I wanted a magnifying glass effect for my articles on pixel art scaling (parts [one]({{< ref "blog/pixel-art-scaling-comparison-part-1" >}}) and [two]({{< ref "blog/pixel-art-scaling-comparison-part-2" >}})), to show the difference between various algorithms.

There are a few jQuery plugins that do this, but I didn't want to add external dependencies, and this was a good excuse to play with the `canvas` element.

<!--more-->

<figure class="full-width-wrapper">
  <canvas id="zoom-target">
    <img id="zoom-target-img" alt="Zoomable image" src="original@2x.png" loading="lazy" />
  </canvas>
  <figcaption>
    Try dragging and dropping your own image file in here.
  </figcaption>
</figure>

{{< script >}}
import ImageZoom from "./zoom.mjs";

new ImageZoom(document.getElementById("zoom-target"), {
  path: document.getElementById("zoom-target-img").src,
});
{{< /script >}}

I tried using [`drawImage`](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/drawImage) to upscale part of the image, but browsers seemed to apply [bilinear](https://en.wikipedia.org/wiki/Bilinear_interpolation) or [bicubic interpolation](https://en.wikipedia.org/wiki/Bicubic_interpolation) by default, which resulted in a blurry mess. Not all browsers supported the `imageSmoothingEnabled` property at the time of writing, so I ended up implementing [nearest-neighbor interpolation](https://en.wikipedia.org/wiki/Nearest-neighbor_interpolation) by hand.
