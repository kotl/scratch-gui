# Creating packaged zip for Scratch Portable that does not require installation

This will likely work for any Posix systems (Mac, Linux) and makes it easier
to replicate Scratch Portable for multiple educator's computers.
Target system where you will copy packaged .zip must be the same hardware wise.
(OS Version, CPU, 32/64 bit, etc)

### Install nodejs

  Install nodejs, either from here: https://nodejs.org/en/download/
  or using sudo apt-get install nodejs (Linux)

### Build

  run:
  ./build-prod
  directly from this directory. You must be connected to internet
  and depending on your connection, it may take a long time.
  If some errors occurred or connection gets interrupted, you may have to run
  this again in order to fully install / build repository.

### Run

   Find .zip file inside distrib/ directory and copy it to target machine.
   Unpack and execute 'run' script.
