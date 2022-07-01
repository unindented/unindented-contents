+++
title = "Terminal Color Preview"
date = "2022-05-19"
tags = ["Color", "Terminal", "Utils"]
+++

I've been playing with terminal color schemes lately, and wanted a way of quickly previewing my changes, so I built this.
{.lead}

<!--more-->

{{< figure class="u-w-col" >}}
  <link rel="stylesheet" href="terminal.css" />

  <form id="terminal-form" class="prose-base flex flex-col gap-4">
    <div class="flex flex-row gap-4">
      <label class="form-label-block flex-1">
        <span>Preset</span>
        <select name="preset" class="form-select">
          <optgroup label="Dark">
            <option value="dracula">Dracula</option>
            <option value="gruvbox_dark_soft">Gruvbox (Dark - Soft Contrast)</option>
            <option value="gruvbox_dark_medium">Gruvbox (Dark - Medium Contrast)</option>
            <option value="gruvbox_dark_hard">Gruvbox (Dark - Hard Contrast)</option>
            <option value="nord">Nord</option>
            <option value="papercolor_dark">Papercolor (Dark)</option>
            <option value="solarized_dark">Solarized (Dark)</option>
            <option value="tokyonight_night" selected>Tokyo Night (Night)</option>
            <option value="tokyonight_storm">Tokyo Night (Storm)</option>
          </optgroup>
          <optgroup label="Light">
            <option value="gruvbox_light_soft">Gruvbox (Light - Soft Contrast)</option>
            <option value="gruvbox_light_medium">Gruvbox (Light - Medium Contrast)</option>
            <option value="gruvbox_light_hard">Gruvbox (Light - Hard Contrast)</option>
            <option value="papercolor_light">Papercolor (Light)</option>
            <option value="solarized_light">Solarized (Light)</option>
            <option value="tokyonight_day">Tokyo Night (Day)</option>
          </optgroup>
          <option value="custom">Custom...</option>
        </select>
      </label>
      <label class="form-label-block hidden flex-1">
        <span>Custom</span>
        <input type="text" name="custom" placeholder="Paste 18 hex colors here..." class="form-input" />
      </label>
    </div>
    <div class="flex flex-row flex-wrap gap-4">
      <label class="form-label-block">
        <span>BG</span>
        <input type="color" name="background" value="#1a1b26" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>FG</span>
        <input type="color" name="foreground" value="#c0caf5" class="form-color" />
      </label>
    </div>
    <div class="flex flex-row flex-wrap gap-4">
      <label class="form-label-block">
        <span>C0</span>
        <input type="color" name="color0" value="#15161e" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C1</span>
        <input type="color" name="color1" value="#f7768e" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C2</span>
        <input type="color" name="color2" value="#9ece6a" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C3</span>
        <input type="color" name="color3" value="#e0af68" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C4</span>
        <input type="color" name="color4" value="#7aa2f7" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C5</span>
        <input type="color" name="color5" value="#bb9af7" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C6</span>
        <input type="color" name="color6" value="#7dcfff" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C7</span>
        <input type="color" name="color7" value="#a9b1d6" class="form-color" />
      </label>
    </div>
    <div class="flex flex-row flex-wrap gap-4">
      <label class="form-label-block">
        <span>C8</span>
        <input type="color" name="color8" value="#414868" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C9</span>
        <input type="color" name="color9" value="#f7768e" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C10</span>
        <input type="color" name="color10" value="#9ece6a" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C11</span>
        <input type="color" name="color11" value="#e0af68" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C12</span>
        <input type="color" name="color12" value="#7aa2f7" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C13</span>
        <input type="color" name="color13" value="#bb9af7" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C14</span>
        <input type="color" name="color14" value="#7dcfff" class="form-color" />
      </label>
      <label class="form-label-block">
        <span>C15</span>
        <input type="color" name="color15" value="#c0caf5" class="form-color" />
      </label>
    </div>

    <pre class="terminal-background terminal-foreground !mb-0">

<span>        </span> <span>       </span> <span>  40m  </span> <span>  41m  </span> <span>  42m  </span> <span>  43m  </span> <span>  44m  </span> <span>  45m  </span> <span>  46m  </span> <span>  47m  </span>
<span>       m</span> <span>  gYw  </span> <span class="terminal-color0-bg">  gYw  </span> <span class="terminal-color1-bg">  gYw  </span> <span class="terminal-color2-bg">  gYw  </span> <span class="terminal-color3-bg">  gYw  </span> <span class="terminal-color4-bg">  gYw  </span> <span class="terminal-color5-bg">  gYw  </span> <span class="terminal-color6-bg">  gYw  </span> <span class="terminal-color7-bg">  gYw  </span>
<span>      1m</span> <span>  gYw  </span> <span class="terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color7-bg font-bold">  gYw  </span>
<span>     30m</span> <span class="terminal-color0-fg">  gYw  </span> <span class="terminal-color0-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color0-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color0-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color0-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color0-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color0-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color0-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color0-fg terminal-color7-bg">  gYw  </span>
<span>   1;30m</span> <span class="terminal-color0-fg font-bold">  gYw  </span> <span class="terminal-color0-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color0-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color0-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color0-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color0-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color0-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color0-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color0-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     31m</span> <span class="terminal-color1-fg">  gYw  </span> <span class="terminal-color1-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color1-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color1-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color1-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color1-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color1-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color1-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color1-fg terminal-color7-bg">  gYw  </span>
<span>   1;31m</span> <span class="terminal-color1-fg font-bold">  gYw  </span> <span class="terminal-color1-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color1-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color1-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color1-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color1-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color1-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color1-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color1-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     32m</span> <span class="terminal-color2-fg">  gYw  </span> <span class="terminal-color2-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color2-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color2-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color2-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color2-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color2-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color2-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color2-fg terminal-color7-bg">  gYw  </span>
<span>   1;32m</span> <span class="terminal-color2-fg font-bold">  gYw  </span> <span class="terminal-color2-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color2-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color2-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color2-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color2-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color2-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color2-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color2-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     33m</span> <span class="terminal-color3-fg">  gYw  </span> <span class="terminal-color3-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color3-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color3-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color3-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color3-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color3-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color3-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color3-fg terminal-color7-bg">  gYw  </span>
<span>   1;33m</span> <span class="terminal-color3-fg font-bold">  gYw  </span> <span class="terminal-color3-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color3-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color3-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color3-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color3-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color3-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color3-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color3-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     34m</span> <span class="terminal-color4-fg">  gYw  </span> <span class="terminal-color4-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color4-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color4-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color4-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color4-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color4-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color4-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color4-fg terminal-color7-bg">  gYw  </span>
<span>   1;34m</span> <span class="terminal-color4-fg font-bold">  gYw  </span> <span class="terminal-color4-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color4-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color4-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color4-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color4-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color4-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color4-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color4-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     35m</span> <span class="terminal-color5-fg">  gYw  </span> <span class="terminal-color5-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color5-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color5-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color5-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color5-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color5-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color5-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color5-fg terminal-color7-bg">  gYw  </span>
<span>   1;35m</span> <span class="terminal-color5-fg font-bold">  gYw  </span> <span class="terminal-color5-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color5-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color5-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color5-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color5-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color5-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color5-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color5-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     36m</span> <span class="terminal-color6-fg">  gYw  </span> <span class="terminal-color6-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color6-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color6-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color6-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color6-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color6-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color6-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color6-fg terminal-color7-bg">  gYw  </span>
<span>   1;36m</span> <span class="terminal-color6-fg font-bold">  gYw  </span> <span class="terminal-color6-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color6-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color6-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color6-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color6-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color6-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color6-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color6-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     37m</span> <span class="terminal-color7-fg">  gYw  </span> <span class="terminal-color7-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color7-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color7-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color7-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color7-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color7-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color7-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color7-fg terminal-color7-bg">  gYw  </span>
<span>   1;37m</span> <span class="terminal-color7-fg font-bold">  gYw  </span> <span class="terminal-color7-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color7-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color7-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color7-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color7-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color7-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color7-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color7-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     90m</span> <span class="terminal-color8-fg">  gYw  </span> <span class="terminal-color8-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color8-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color8-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color8-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color8-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color8-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color8-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color8-fg terminal-color7-bg">  gYw  </span>
<span>   1;90m</span> <span class="terminal-color8-fg font-bold">  gYw  </span> <span class="terminal-color8-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color8-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color8-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color8-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color8-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color8-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color8-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color8-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     91m</span> <span class="terminal-color9-fg">  gYw  </span> <span class="terminal-color9-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color9-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color9-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color9-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color9-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color9-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color9-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color9-fg terminal-color7-bg">  gYw  </span>
<span>   1;91m</span> <span class="terminal-color9-fg font-bold">  gYw  </span> <span class="terminal-color9-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color9-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color9-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color9-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color9-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color9-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color9-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color9-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     92m</span> <span class="terminal-color10-fg">  gYw  </span> <span class="terminal-color10-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color10-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color10-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color10-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color10-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color10-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color10-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color10-fg terminal-color7-bg">  gYw  </span>
<span>   1;92m</span> <span class="terminal-color10-fg font-bold">  gYw  </span> <span class="terminal-color10-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color10-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color10-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color10-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color10-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color10-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color10-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color10-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     93m</span> <span class="terminal-color11-fg">  gYw  </span> <span class="terminal-color11-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color11-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color11-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color11-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color11-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color11-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color11-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color11-fg terminal-color7-bg">  gYw  </span>
<span>   1;93m</span> <span class="terminal-color11-fg font-bold">  gYw  </span> <span class="terminal-color11-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color11-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color11-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color11-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color11-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color11-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color11-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color11-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     94m</span> <span class="terminal-color12-fg">  gYw  </span> <span class="terminal-color12-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color12-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color12-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color12-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color12-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color12-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color12-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color12-fg terminal-color7-bg">  gYw  </span>
<span>   1;94m</span> <span class="terminal-color12-fg font-bold">  gYw  </span> <span class="terminal-color12-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color12-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color12-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color12-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color12-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color12-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color12-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color12-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     95m</span> <span class="terminal-color13-fg">  gYw  </span> <span class="terminal-color13-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color13-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color13-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color13-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color13-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color13-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color13-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color13-fg terminal-color7-bg">  gYw  </span>
<span>   1;95m</span> <span class="terminal-color13-fg font-bold">  gYw  </span> <span class="terminal-color13-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color13-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color13-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color13-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color13-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color13-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color13-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color13-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     96m</span> <span class="terminal-color14-fg">  gYw  </span> <span class="terminal-color14-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color14-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color14-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color14-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color14-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color14-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color14-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color14-fg terminal-color7-bg">  gYw  </span>
<span>   1;96m</span> <span class="terminal-color14-fg font-bold">  gYw  </span> <span class="terminal-color14-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color14-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color14-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color14-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color14-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color14-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color14-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color14-fg terminal-color7-bg font-bold">  gYw  </span>
<span>     97m</span> <span class="terminal-color15-fg">  gYw  </span> <span class="terminal-color15-fg terminal-color0-bg">  gYw  </span> <span class="terminal-color15-fg terminal-color1-bg">  gYw  </span> <span class="terminal-color15-fg terminal-color2-bg">  gYw  </span> <span class="terminal-color15-fg terminal-color3-bg">  gYw  </span> <span class="terminal-color15-fg terminal-color4-bg">  gYw  </span> <span class="terminal-color15-fg terminal-color5-bg">  gYw  </span> <span class="terminal-color15-fg terminal-color6-bg">  gYw  </span> <span class="terminal-color15-fg terminal-color7-bg">  gYw  </span>
<span>   1;97m</span> <span class="terminal-color15-fg font-bold">  gYw  </span> <span class="terminal-color15-fg terminal-color0-bg font-bold">  gYw  </span> <span class="terminal-color15-fg terminal-color1-bg font-bold">  gYw  </span> <span class="terminal-color15-fg terminal-color2-bg font-bold">  gYw  </span> <span class="terminal-color15-fg terminal-color3-bg font-bold">  gYw  </span> <span class="terminal-color15-fg terminal-color4-bg font-bold">  gYw  </span> <span class="terminal-color15-fg terminal-color5-bg font-bold">  gYw  </span> <span class="terminal-color15-fg terminal-color6-bg font-bold">  gYw  </span> <span class="terminal-color15-fg terminal-color7-bg font-bold">  gYw  </span>

</pre>
</form>
{{< /figure >}}

{{< script >}}
const form = document.getElementById("terminal-form");
const customInput = form.querySelector('[name="custom"]');
const customLabel = customInput.closest("label");
const colorRegexp = /(?:#|0x)((?:[0-9A-F]{3}){1,2})/gi;
const colorNumbers = Array.from(Array(16).keys());
const colorNames = ["background", "foreground", ...colorNumbers.map((i) => `color${i}`)];

const fetchPreset = async (name) => {
  const response = await fetch(`presets/${name}.json`);
  return response.json();
};

const parsePreset = (str) => {
  const matches = str.matchAll(colorRegexp);
  return Array.from(matches).reduce((acc, match, i) => {
    acc[colorNames[i]] = `#${match[1]}`;
    return acc;
  }, {});
};

const displayPreset = (preset) => {
  Object.keys(preset).forEach((key) => {
    form.querySelector(`[name="${key}"]`).value = preset[key];
    form.style.setProperty(`--terminal-${key}`, preset[key]);
  });
};

form.addEventListener("input", async (evt) => {
  const { name, value } = evt.target;
  if (name === "preset" && value !== "custom") {
    customLabel.classList.toggle("hidden", true);
    const preset = await fetchPreset(value);
    displayPreset(preset);
  } else if ((name === "preset" && value === "custom") || name === "custom") {
    customLabel.classList.toggle("hidden", false);
    const preset = parsePreset(customInput.value);
    displayPreset(preset);
  } else {
    form.style.setProperty(`--terminal-${name}`, value);
  }
});
{{< /script >}}

This way of visualizing terminal colors is based on this script by Daniel Crisman, found in the [Bash Prompt HOWTO](https://tldp.org/HOWTO/Bash-Prompt-HOWTO/x329.html):

```bash
#!/bin/bash

T='gYw'

echo -e "\n                 40m     41m     42m     43m\
     44m     45m     46m     47m";

for FGs in '    m' '   1m' '  30m' '1;30m' '  31m' '1;31m' '  32m' \
           '1;32m' '  33m' '1;33m' '  34m' '1;34m' '  35m' '1;35m' \
           '  36m' '1;36m' '  37m' '1;37m';
  do FG=${FGs// /}
  echo -en " $FGs \033[$FG  $T  "
  for BG in 40m 41m 42m 43m 44m 45m 46m 47m;
    do echo -en "$EINS \033[$FG\033[$BG  $T  \033[0m";
  done
  echo;
done
echo
```