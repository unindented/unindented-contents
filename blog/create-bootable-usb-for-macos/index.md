+++
title = "Create a Bootable USB for macOS Ventura"
date = "2023-01-01"
tags = ["macOS"]
+++

I find it useful to have a bootable USB lying around, in case I need to do a clean install, or recover from catastrophic failures.
{.lead}

<!--more-->

## Creating a bootable USB

Creating a bootable USB is relatively straightforward:

1. Download [macOS Ventura from the App Store](https://apps.apple.com/app/macos-ventura/id1638787999).
2. Connect a 16GB or larger USB drive.
3. Run the following command from a terminal (replacing `/Volumes/Untitled` with the path to your USB drive):

```
sudo /Applications/Install\ macOS\ Ventura.app/Contents/Resources/createinstallmedia --volume /Volumes/Untitled --nointeraction
```

## Booting from the USB

Booting from the USB you just created requires slightly different steps depending on the architecture of your device. If you're on Apple silicon, do the following:

1. Connect the USB drive.
2. Turn off the device.
3. Press and hold the power button until you see the startup options screen.

If you're on a device with an Intel processor, do this instead:

1. Connect the USB drive.
2. Turn off or restart the device.
3. Press and hold <kbd>⌥ Option</kbd> or <kbd>Alt</kbd> until you see the startup manager.

Here's an [official article on startup key combinations](https://support.apple.com/HT201255), in case you want to know more.
