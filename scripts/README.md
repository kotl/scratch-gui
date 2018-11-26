# General information

Scratch Portable is a modified version of Scratch 3.0 that is enabled with the following features:
* It can save/load projects.
* It can run on Local Area Network and does not need Internet connection at all.
* It comes with small, but simple Admin panel that allows educator to change passwords for any users created within this 
closed eco-system as well as copy their projects to 'admin' user. (admin user itself is capable of logging into Scratch).
* Scratch Portable was initially developed to experiment with CS First Offline solution, however after several suggestions it 
was decided to make it available in a standalone package.

# Windows installation:

## [Compiling with nodejs](win/README.md)
## Packaging with NSIS (guide to be written)
## Or use [released installer](https://github.com/kotl/scratch-portable/releases)

# Running Scratch Portable with nodejs on MacOS or Linux

## Step 1.

  Install nodejs, either from here: https://nodejs.org/en/download/
  or using sudo apt-get install nodejs
 
  Note: some installation may missing npm, this will be a problem and you
  will have to figure out how to install npm.

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
