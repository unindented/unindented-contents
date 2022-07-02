+++
title = "CHIP-8 Interpreter and Debugger with JS"
date = "2023-01-08"
tags = ["Emulation"]
draft = true
+++

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ornare nisi at augue ullamcorper, eget faucibus magna eleifend.
{.lead}

<!--more-->

{{< figure class="u-w-bleed" >}}
  <div id="chip-8-target" class="bg-gray-100 p-8 dark:bg-gray-800"></div>
{{< /figure >}}

{{< script >}}
import Workbench from "./workbench.mjs";

new Workbench(document.getElementById("chip-8-target"));
{{< /script >}}
