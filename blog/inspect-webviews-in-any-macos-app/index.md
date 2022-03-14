+++
title = "Inspect WebViews in Any macOS App"
date = "2022-04-04"
tags = ["macOS"]
+++

Did you know you can inspect any WebView on any macOS app, just by right-clicking it?
{.lead}

<!--more-->

The only thing you need to do is change your user defaults by running the following command:

```
defaults write -g WebKitDeveloperExtras -bool true
```

Once you do that, you should be able to right-click inside any WebView, and you'll get a context menu like this one:

![Family Sharing screen with context menu showing "Inspect Element" option](inspect-element@2x.png)

If you select _Inspect Element_, you get a full Web Inspector, just like you would in Safari.

![Inspecting one of the buttons in the Family Sharing screen](inspecting@2x.png)

I love peeking behind the curtain. Look, [system colors](https://drafts.csswg.org/css-color/#css-system-colors) in the wild!

![Web Inspector showing the styles of one of the buttons](inspector@2x.png)
