echo This script produces packaged Scratch Portable for Windows

cd /D "%~dp0"

cd ..\..

call scripts\win\build-shared.bat

del /S /Q distrib\ScratchPortable\*.*

cd server
call node scratch_portable_win.js
copy /Y node_modules\sqlite3\lib\binding\node-v64-win32-x64\node_sqlite3.node ..\distrib\ScratchPortable\
cd ..

"C:\Program Files (x86)\NSIS\makensis" scripts\win_distrib\ScratchPortable.nsi
