+++
title = "Change Shell to Latest Bash on macOS"
date = "2023-01-04"
tags = ["macOS", "Terminal"]
+++

Starting with macOS Catalina, [Apple switched the default shell from Bash to Zsh](https://support.apple.com/HT208050). Also, the built-in version of Bash is horribly outdated. No bueno.
{.lead}

<!--more-->

## Installing the latest version of Bash

You may be surprised to learn that even the latest versions of macOS ship with Bash 3.2, which dates from 2007:

```sh
/bin/bash --version
# GNU bash, version 3.2.57(1)-release (arm64-apple-darwin22)
# Copyright (C) 2007 Free Software Foundation, Inc.
```

This probably has to do with the licensing change that happened with Bash 4.0, which switched to GPLv3. Anyways, you can install the latest version of Bash via [Homebrew](https://brew.sh/):

```sh
brew install bash
/opt/homebrew/bin/bash --version
# GNU bash, version 5.2.15(1)-release (aarch64-apple-darwin22.1.0)
# Copyright (C) 2022 Free Software Foundation, Inc.
# License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
```

That's more like it.

## Changing the default shell to Bash

Now you just need to allowlist Homebrew's Bash, and set it as default:

```sh
sudo sh -c 'echo /opt/homebrew/bin/bash >> /etc/shells'
chsh -s /opt/homebrew/bin/bash
```

If you open a new terminal window, you should see your changes take effect:

```sh
echo $BASH_VERSION
# 5.2.15(1)-release
```

If you also want to change the default shell for the root user, run the following:

```
sudo chsh -s /usr/local/bin/bash
```

Now if you use `sudo su` you'll also see the latest Bash.

## Updating scripts

If you have scripts with a shebang line that references `/bin/bash`, they'll still use the outdated version:

```sh {hl_lines=[1]}
#!/bin/bash
echo $BASH_VERSION
```

You'll probably want to update them to say this instead:

```sh {hl_lines=[1]}
#!/usr/bin/env bash
echo $BASH_VERSION
```

Alrighty, you should be running the latest Bash everywhere now!
