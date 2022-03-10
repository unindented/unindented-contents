+++
title = "Prime Spiral with p5.js"
date = "2022-03-06"
tags = ["Math", "p5.js"]
p5 = true
+++

The prime spiral, also known as [Ulam spiral](https://en.wikipedia.org/wiki/Ulam_spiral), is a neat visualization of prime numbers devised by mathematician [Stanisław Ulam](https://en.wikipedia.org/wiki/Stanislaw_Ulam).
{.lead}

<!--more-->

It arranges positive integers in a square spiral, highlighting the ones that are primes:

{{< p5
  name="small-spiral"
  actions="play pause download"
  class="u-w-col"
>}}
import sketch from "./sketch.mjs";

sketch(document.getElementById("small-spiral"), {
  showNumbers: true,
  size: 15,
});
{{< /p5 >}}

If you draw a bigger spiral, you'll notice patterns forming around some horizontal, vertical, and diagonal lines. They correspond to certain polynomials that are known to produce a high density of prime numbers. Interesting, huh?

{{< p5
  name="big-spiral"
  actions="play pause download"
  class="u-w-col"
>}}
import sketch from "./sketch.mjs";

sketch(document.getElementById("big-spiral"), {
  size: 201,
});
{{< /p5 >}}
