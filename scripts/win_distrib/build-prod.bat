
cd /D "%~dp0"

cd ..\..

call ..\node\nodevars

call scripts\win_local\build-prod.bat

del /S /Q distrib\ScratchPortable\*.*

cd server
call node scratch_portable.js
copy /Y node_modules\sqlite3\lib\binding\node-v64-win32-x64\node_sqlite3.node ..\distrib\ScratchPortable\
cd ..

copy /Y scripts\win_distrib\Service*.bat distrib\ScratchPortable\
copy /Y scripts\win_distrib\Run*.bat distrib\ScratchPortable\
copy /Y scripts\win_distrib\nssm.exe distrib\ScratchPortable\

"C:\Program Files (x86)\NSIS\makensis" scripts\win_distrib\ScratchPortable.nsi
