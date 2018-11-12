# Scripts for running Scratch Portable with nodejs on MacOS or Linux

##Step 1.

  Install nodejs, either from here: https://nodejs.org/en/download/
  or using sudo apt-get install nodejs
 
  Note: some installation may missing npm, this will be a problem and you
  will have to figure out how to install npm.

##Step 2.

  run:
  ./build-prod
  directly from this directory. You must be connected to internet
  and depending on your connection, it may take a long time. 
  If some errors occurred or connection gets interrupted, you may have to run
  this again in order to fully install / build repository.

##Step 3.

  Now you are ready to run Scratch Portable. You can use this step again next
  time you boot your computer to start serving content. No need to repeat steps 1 and 2.
  
  run:
  sudo ./serve-ind

  in case you need to stop, it press Ctrl+C
