+++
title = "Lorenz Attractor with JS"
date = "2014-02-16"
tags = ["Math"]
+++

Drawing a [Lorenz attractor](https://en.wikipedia.org/wiki/Lorenz_system) by absolutely positioning `span` elements along the _x_ and _y_ axes, and faking the _z_ axis by adjusting their size.

<!--more-->

<figure class="full-width-wrapper">
  <link rel="stylesheet" href="attractor.css" />

  <div id="attractor-target">
  </div>
</figure>

{{< script >}}
import LorenzAttractor from "./attractor.mjs";

new LorenzAttractor(document.getElementById("attractor-target"), {
  sx: 0,
  sy: 8,
  sz: 10,
});
{{< /script >}}
