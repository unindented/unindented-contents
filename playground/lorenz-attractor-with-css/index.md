+++
title = "Lorenz Attractor with CSS"
date = "2014-02-15"
tags = ["CSS", "Math"]
+++

Drawing a [Lorenz attractor](https://en.wikipedia.org/wiki/Lorenz_system) with CSS shadows. No JavaScript involved.
{.lead}

<!--more-->

{{< figure class="u-w-bleed" >}}
  <link rel="stylesheet" href="attractor.css" />

  <div id="attractor-target" class="overflow-hidden bg-gray-100 dark:bg-gray-800">
    <span class="text-transparent">·</span>
  </div>
{{< /figure >}}

You don't want to see the CSS though. It's a huge `text-shadow` property with the coordinates for each of the 5000 iterations of the equations that Sass ran.
