<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [What is Scratch Portable?](#what-is-scratch-portable)
- [Packaged mode](#packaged-mode)
- [Sharing on Local Area Network and notes on port 80 (http)](#sharing-on-local-area-network-and-notes-on-port-80-http)
- [Using node-cluster for better performance](#using-node-cluster-for-better-performance)
- [Running and connecting to Scratch Portable](#running-and-connecting-to-scratch-portable)
  - [Connecting](#connecting)
  - [WiFi client isolation](#wifi-client-isolation)
  - [Public directory](#public-directory)
- [Windows installation](#windows-installation)
  - [Use released installer](#use-released-installer)
  - [Create installer with NSIS](#create-installer-with-nsis)
  - [Compiling with nodejs](#compiling-with-nodejs)
- [MacOS or Linux installation](#macos-or-linux-installation)
  - [Use (for MacOS) released installer](#use-for-macos-released-installer)
  - [Packaging into a .zip file](#packaging-into-a-zip-file)
  - [Compile and run with nodejs (Linux or MacOS)](#compile-and-run-with-nodejs-linux-or-macos)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# What is Scratch Portable?

Scratch Portable is a modified version of Scratch 3.0 that is enabled with the following features:
* Hosted on educators computer only and used by entire class of students
* Can save/load projects.
* Runs on Local Area Network and does not need Internet connection at all.
* Comes with small, but simple Admin panel that allows educator to change passwords for any users created within this closed eco-system as well as copy their projects to 'admin' user. (admin user itself is capable of logging into Scratch).
* Mac, Windows and Linux are supported as hosting platforms. Clients can use any modern web browser to connect.
(Flash or installation is not needed for clients). Scratch 3.0 works entirely through the browser.
* Scratch Portable was initially developed to experiment with CS First Offline solution, however after several suggestions it was decided to make it available in a standalone package.

# Packaged mode
* For all 3 supported hosting platforms, Scratch Portable can be packaged into release binary that contains 2 or 3 files that don't require installation, just unzip it and use it. For Windows, simple standalone installer is also supported.

# Sharing on Local Area Network and notes on port 80 (http)
* In order to provide service on port 80 (http), Linux and MacOS require admin rights (sudo / root)
* Http port provides zero security if someone is eavesdropping on network packets. This version of Scratch does not support encrypted connection, so please be aware of this limitation of the software. An attacker who can see network packets will be able to capture username and passwords that are used to be signed into this version of Scratch.
    * Make sure Wifi network has at least WEP2 encryption and requires password to connect. This adds a small
    layer of security against possibility of eavesdropping.
* Scratch Portable does not work as a service. It means that you have to manually start it and manually stop it.
When you stop it (using Ctrl+C in it's terminal window), you are no longer serving content over LAN or Internet. If you are done with your lesson, it probably makes sense to stop it.

# Using node-cluster for better performance

As an experiment, if you compile from source (download / clone this repo and use compiling instructions),
you can run clusterized version of Scratch Portable that should more effeciently use multiple CPUs on your
computer. Clusterization does not work in packaged mode. The following scripts are provided:
* serve-ind-cluster (MacOS / Linux)
* win/serve-ind-cluster.bat (Windows)

# Running and connecting to Scratch Portable
## Connecting
Once you follow installation steps below and start it, you
will see console window. It should explain what is your current IP address and how you should
connect to it through the browser. The output in the window should be self-explanatory.
Here is typical output:
```
BACKUP APP SERVER STARTED
APP SERVER STARTED
ADMIN SERVER STARTED
--------------------------------------------------------------------
--                                                                --
--     Welcome to Scratch Portable                                --
--                                                                --
--     Scratch is running on 2 different ports                    --
--     http://192.168.1.119                                       --
--     http://192.168.1.119:3000                                  --
--                                                                --
--     Web directory for your education materials:                --
--     http://192.168.1.119/public                                --
--                                                                --
--     Admin Panel is running at                                  --
--     http://192.168.1.119:3001/admin                            --
--                                                                --
--     Default password for Admin panel is 'admin'.               --
--     You will be asked to change it.                            --
--                                                                --
--     To sign into Scratch use any 4-letter username / password  --
--     and it will be created automaticaly.                       --
--                                                                --
--     To stop Scratch Portable, press Ctrl+C                     --
--                                                                --
--------------------------------------------------------------------
```

## WiFi client isolation
In case you find that other computers can not connect to yours, make sure you are using the same Wifi SSID and 'Client Isolation' setting in your router is OFF. Alternatively, you can connect ethernet cable directly from the router to hosting computer and in that case 'Client Isolation' being off will not be required.

## Public directory
You can add any files into 'public' directory which makes it browsable through the /public folder on the
web. This could be useful if you want to share Scratch 2 project to be imported by student or
a video or document to be watched or viewed.

# Windows installation

## Use [released installer](https://github.com/kotl/scratch-portable/releases)
## [Create installer with NSIS](win_distrib/README.md)
## [Compiling with nodejs](win/README.md)

# MacOS or Linux installation

## Use (for MacOS) [released installer](https://github.com/kotl/scratch-portable/releases)
## [Packaging into a .zip file](distrib/README.md)

## Compile and run with nodejs (Linux or MacOS)

### Install nodejs

  Install nodejs, either from here: https://nodejs.org/en/download/
  or using sudo apt-get install nodejs

### Build

  run:
  ./build-prod
  directly from this directory. You must be connected to internet
  and depending on your connection, it may take a long time.
  If some errors occurred or connection gets interrupted, you may have to run
  this again in order to fully install / build repository.

### Run

  Now you are ready to run Scratch Portable. You can use this step again next
  time you boot your computer to start serving content. No need to repeat steps 1 and 2.

  run:
  sudo ./serve-ind

  in case you need to stop, it press Ctrl+C

  Alternatively, you can run serve-ind-cluster which should be more performant version using node-cluster.
