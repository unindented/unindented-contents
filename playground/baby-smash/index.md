+++
title = "Baby Smash!"
date = "2022-04-28"
tags = ["Kids"]
+++

My kids love [Baby Smash!](https://www.hanselman.com/babysmash/), a Windows app that draws letters and shapes, and plays sounds, as they smash the keyboard and mouse.
{.lead}

This is a crude attempt to replicate it using web technologies. We can't capture certain key combinations and gestures, so it's not very baby-safe.

<!--more-->

{{< figure class="u-w-bleed" >}}
  <link rel="stylesheet" href="smash.css" />

  <div
    tabindex="-1"
    id="smash-container"
    class="relative min-h-[50vh] select-none overflow-hidden bg-gray-100 outline-none dark:bg-gray-800"
  >
    <div
      id="smash-dummy"
      class="absolute top-full left-full animate-[anim_5s_ease-in-out_forwards] font-bold leading-none"
    ></div>
    <button
      type="button"
      id="smash-button"
      class="absolute top-0 right-0 bottom-0 left-0 z-10 flex w-full items-center justify-center opacity-50 transition-opacity hover:opacity-100 focus:opacity-100"
    >
      <svg height="10em" viewBox="0 0 512 512" fill="currentColor">
        {{< sprite play >}}
      </svg>
      <span class="sr-only">Start</span>
    </button>
  </div>
{{< /figure >}}

{{< script >}}
import BabySmash from "./smash.mjs";

new BabySmash({
  container: document.getElementById("smash-container"),
  dummy: document.getElementById("smash-dummy"),
  button: document.getElementById("smash-button"),
});
{{< /script >}}
