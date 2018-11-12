# Scripts for running Scratch Portable with nodejs unzipped as binary (no install required)

Note: you will still need to have admin rights in order to serve content on port 80.

##Step 1.

Unpack nodejs binary for Windows on the same level where you unpacked scratch-gui.
You can download, for example, https://nodejs.org/dist/v10.13.0/node-v10.13.0-win-x64.zip

It should be in a folder called node and look like this:

node\
      npm.cmd
      node.cmd

scratch-gui\
            scripts\
                   win_local\
                              this directory.
##Step 2.

  run build-prod.bat directly from this directory. You must be connected to internet
  and depending on your connection, it may take a long time. 
  If some errors occurred or connection gets interrupted, you may have to run
  this again in order to fully install / build repository.

##Step 3.
  Now you are ready to run Scratch Portable. You can use this step again next
  time you boot your computer to start serving content. No need to repeat steps 1 and 2.
  
  run serve-ind.bat

  in case you need to stop, it press Ctrl+C
