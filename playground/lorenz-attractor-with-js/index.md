+++
title = "Lorenz Attractor with JS"
date = "2014-02-16"
tags = ["Math"]
+++

Drawing a [Lorenz attractor](https://en.wikipedia.org/wiki/Lorenz_system) by absolutely positioning `span` elements along the _x_ and _y_ axes, and faking the _z_ axis by adjusting their size.
{.lead}

<!--more-->

{{< figure class="u-w-bleed" >}}
  <link rel="stylesheet" href="attractor.css" />

  <div id="attractor-target" class="overflow-hidden bg-gray-100 dark:bg-gray-800"></div>
{{< /figure >}}

{{< script >}}
import LorenzAttractor from "./attractor.mjs";

new LorenzAttractor(document.getElementById("attractor-target"), {
  sx: 0,
  sy: 8,
  sz: 10,
});
{{< /script >}}

Nothing mind-blowing, but the result is pretty!
