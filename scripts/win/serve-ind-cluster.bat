cd /D "%~dp0"
cd ..\..\
set SCRATCH_MODE=IND
node server\cluster.js "%cd%"\
