+++
title = "Clipboard Inspector"
date = "2023-01-05"
tags = ["Clipboard", "Utils"]
+++

Small widget to explore the data available when you paste or drop something on a web page.
{.lead}

<!--more-->

{{< figure class="u-w-col" >}}
  <div id="clipboard-drop-zone" class="border-8 border-dashed border-gray-200 px-12 py-8 dark:border-gray-700">
    <ul>
      <li><button type="button" id="clipboard-paste-button" class="form-button !m-0">Inspect your clipboard</button> using the Clipboard API.</li>
      <li>Paste with <kbd>Ctrl</kbd> + <kbd>V</kbd> or <kbd>⌘ Cmd</kbd> + <kbd>V</kbd>.</li>
      <li>Drop something here.</li>
    </ul>
  </div>
{{< /figure >}}

{{< figure class="u-w-bleed" >}}
  <div id="clipboard-output" class="mx-4 sm:mx-8"></div>
{{< /figure >}}

{{< script >}}
import ClipboardInspector from "./clipboard.mjs";

new ClipboardInspector({
  dropZone: document.getElementById("clipboard-drop-zone"),
  pasteButton: document.getElementById("clipboard-paste-button"),
  output: document.getElementById("clipboard-output"),
});
{{< /script >}}
