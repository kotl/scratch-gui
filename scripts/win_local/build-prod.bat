cd /D "%~dp0"
cd ..\..\

call ..\node\nodevars

call ..\win\build-shared.bat
