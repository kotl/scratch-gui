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

# Windows installation:

## [Compiling with nodejs](win/README.md)
## [Packaging with NSIS](win_distrib/README.md)
## Or use [released installer](https://github.com/kotl/scratch-portable/releases)

# Running / Installing Scratch Portable on MacOS or Linux

## [Packaging into a .zip file](distrib/README.md)
## Use (for MacOS) [released installer](https://github.com/kotl/scratch-portable/releases)

## Compile and run with nodejs (Linux or MacOS)

## Step 1.

  Install nodejs, either from here: https://nodejs.org/en/download/
  or using sudo apt-get install nodejs

## Step 2.

  run:
  ./build-prod
  directly from this directory. You must be connected to internet
  and depending on your connection, it may take a long time.
  If some errors occurred or connection gets interrupted, you may have to run
  this again in order to fully install / build repository.

## Step 3.

  Now you are ready to run Scratch Portable. You can use this step again next
  time you boot your computer to start serving content. No need to repeat steps 1 and 2.

  run:
  sudo ./serve-ind

  in case you need to stop, it press Ctrl+C

  Alternatively, you can run serve-ind-cluster which should be more performant version using node-cluster.
