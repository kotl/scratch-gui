
cd /D "%~dp0"

cd ..\..

call ..\node\nodevars

call scripts\win_local\build-prod.bat

cd server
call node scratch_portable.js
copy /Y node_modules\sqlite3\lib\binding\node-v64-win32-x64\node_sqlite3.node ..\distrib\ScratchPortable\
cd ..

copy /Y scripts\win_distrib\install.bat distrib\ScratchPortable\
copy /Y scripts\win_distrib\run.bat distrib\ScratchPortable\
copy /Y scripts\win_distrib\uninstall.bat distrib\ScratchPortable\
copy /Y scripts\win_distrib\nssm.exe distrib\ScratchPortable\
