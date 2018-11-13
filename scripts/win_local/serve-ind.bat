cd /D "%~dp0"
cd ..\..\

call ..\node\nodevars

set SCRATCH_MODE=IND
node server\server.js
