cd /D "%~dp0"

cd ..\..

del /s distrib\scratchportableinstall.exe
"C:\Program Files (x86)\NSIS\makensis" scripts\win_distrib\ScratchPortable.nsi
distrib\scratchportableinstall.exe
