+++
title = "Deploying a Web App to a 2016 Samsung SmartTV"
date = "2019-04-06"
tags = ["Tizen"]
+++

Lately I've been building a web app for my [2016 Samsung SmartTV](https://amzn.unindented.org/B01FFQEP6I) using [React Native for Web](https://github.com/necolas/react-native-web). It's a [Twitch](https://www.twitch.tv/) client that you can control with your remote.

![Screenshot of Tizen TV web app](app-screenshot@2x.png)

Deploying this app to the TV is a pain in the rear. You need to follow the steps outlined in [Samsung's quick-start guide to developing web applications](https://developer.samsung.com/tv/develop/getting-started/quick-start-guide). That guide is not particularly well written, and it's missing some key details, so I've decided to document the steps I followed.

<!--more-->

## Prerequisites

The only thing listed in the [TV extension prerequisites](https://developer.samsung.com/tv/develop/tools/prerequisites/) is Java. I encountered errors with Java 11 on macOS Mojave, so it's probably safer to stick with [Java 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).

## Tizen Studio

Once Java is installed, the next thing to do is download and install [*Tizen Studio*](https://developer.tizen.org/development/tizen-studio/download).

![Installing Tizen Studio 3.0](tizen-studio@2x.png)

It's an Eclipse-based IDE, plus some other tooling, that Samsung provides to help you develop apps for its devices. *(Yeah, Eclipse is still a thing in 2019. I was surprised too.)*

Once the installation finishes, try starting *Tizen Studio*. If it fails to start, check the contents of `~/tizen-workspace/.metadata/.log`. That's how I discovered that Java 11 was causing issues.

## Package Manager

Now launch the *Package Manager* app that got installed with *Tizen Studio*:

![Launching Package Manager](package-manager-1@2x.png)

Switch to the *Extensions SDK* tab, and install both the *Samsung Certificate Extension*, and the *TV Extensions-X.Y* appropriate for the TV you're going to be deploying to:

![Switching to the Extensions SDK tab](package-manager-2@2x.png)

I'm going to be deploying to a 2016 TV, but Tizen Studio 3.0 only allows us to install *TV Extensions-4.0*, which doesn't support TVs that "old". The solution is to download the *TV Extension 3.1.2* image from the [TV Extension archive](https://developer.samsung.com/tv/develop/tools/tv-extension/archive):

![Downloading the TV Extension 3.1.2 image](tv-extension-archive@2x.png)

Once downloaded, go back to the *Package Manager* window, click on the *Configuration* cog, and expand the *Extension SDK* section at the bottom of that dialog:

![The Extension SDK section of the configuration dialog](package-manager-3@2x.png)

Click the plus sign to add a new repository, and choose the location of the zip file you downloaded earlier:

![Adding the TV Extension 3.1.2 image as extension repository](package-manager-4@2x.png)

Enable the new repository, and disable all others:

![Enabling the new extension repository](package-manager-5@2x.png)

If you close the dialog and go back to the *Extension SDK* tab, you'll see the new extension. Now install it:

![The Extensions SDK tab with TV Extensions-3.0](package-manager-6@2x.png)

That was fun, wasn't it? 😭

## Enabling developer mode on the TV

To be able to install your own apps on the TV, you'll need to enable its developer mode. To do so, open your *Apps* screen:

![The Apps screen on the TV](tv-apps@2x.png)

Then press *1*, *2*, *3*, *4*, *5* using your remote or the on-screen keypad. A dialog will show up. In that dialog, turn *Developer mode* to *On*, and enter the IP address of your computer. You may need to reboot the TV for the changes to take effect.

## Device Manager

Launch the *Device Manager* app that got installed with *Tizen Studio*, click the *Remote Device Manager* button, and then click the *Scan Devices* button in that dialog:

![The Remote Device Manager dialog](device-manager@2x.png)

The IP of your TV should be listed there. Toggle its *Connection* switch, and after a few seconds your TV will show up in the main window. You'll now create a certificate and install it on the TV, so that you can deploy the app.

## Certificate Manager

Launch the *Certificate Manager* app that got installed with *Tizen Studio*, and dismiss the first dialog it shows you:

![Dismissing the initial Certificate Manager dialog](certificate-manager-1@2x.png)

Now click the plus sign to add a new certificate:

![The Certificate Manager dialog](certificate-manager-2@2x.png)

You'll be creating a Samsung certificate:

![Creating a new Samsung certificate](certificate-manager-3@2x.png)

Device type will be *TV*:

![Device type is TV](certificate-manager-4@2x.png)

Name your certificate profile to whatever you want:

![Profile name can be whatever you want](certificate-manager-5@2x.png)

You'll be creating a new author certificate:

![Creating a new author certificate](certificate-manager-6@2x.png)

Fill out the details of this new certificate:

![Details of the new author certificate](certificate-manager-7@2x.png)

Enter a path to store a backup of the certificate:

![Backing up the new author certificate](certificate-manager-8@2x.png)

You'll also be creating a new distributor certificate:

![Creating a new distributor certificate](certificate-manager-9@2x.png)

In the next screen, you should see the DUID for your TV in the list:

![Adding the DUID of your TV to the distributor certificate](certificate-manager-10@2x.png)

If it's not there, switch to the *Device Manager* app, right click your TV, and click the *DUID* option:

![Copying the DUID of your TV](device-manager-duid@2x.png)

That will copy the DUID to your clipboard. Go back to the *Certificate Manager* app, paste it, and click *Next*.

![The distributor certificate has been created successfully](certificate-manager-11@2x.png)

Now the new certificate profile will show up as active:

![The new certificate profile is active](certificate-manager-12@2x.png)

Switch back to the *Device Manager* app, right click your TV, and click the *Permit to install applications* option:

![Uploading your certificate to the TV](device-manager-certificate@2x.png)

If everything goes well, you'll see a success dialog:

![Successfully installed the certificate on the TV](device-manager-certificate-success@2x.png)

Now you should be able to run the app on your TV.

## Deploying from Tizen Studio

One way of deploying the app to your TV is to import the folder with all the assets for your app into Tizen Studio, and then right click on the project and select *Run As > Tizen Web Application*:

![Running the app from Tizen Studio](tizen-studio-run@2x.png)

However, that process takes a really long time for my app, especially with minified JavaScript bundles. I think it's because it tries to parse the files to lint them, and whatever parser it's using is terrible. So here's an alternative.

## Deploying from the command line

There's a way to package and deploy the app from the command line. You just need to add a folder to your `PATH`:

```
export TIZEN_STUDIO_HOME="$HOME/tizen-studio/tools/ide"
export PATH="$PATH:$TIZEN_STUDIO_HOME/bin"
```

You can check that the `tizen` binary is found by running `tizen version`:

```
$ tizen version
Tizen CLI 2.4.48
```

Assuming the production build for your app lives in a folder called `dist`, you'd package the app with:

```
tizen package -t wgt -- dist
```

You'd install the packaged app on your TV with:

```
tizen install -n MyApp.wgt -- dist
```

And finally you'd run the app on your TV with:

```
tizen run -p xxxxxyyyyy.MyApp -- dist
```

Every time you make a change, you'll have to package and install, but at least you won't have to interact with Tizen Studio...
