cd /D "%~dp0"
cd ..\..\

call ..\node\nodevars

call scripts\win\build-shared.bat
