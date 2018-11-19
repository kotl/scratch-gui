!include MUI2.nsh

Name "Scratch 3.0 Portable"

; The file to write
OutFile "..\..\distrib\ScratchPortableInstall.exe"

; The default installation directory
InstallDir "$DESKTOP\Scratch Portable"

; Request application privileges for Windows Vista
RequestExecutionLevel user

;--------------------------------

; Pages

Page directory
Page components
Page instfiles

;--------------------------------

; The stuff to install
Section "" ;No components page, name is not important

  ; Set output path to the installation directory.
  SetOutPath $INSTDIR
  
  ; Put file there
  File ..\..\distrib\ScratchPortable\node_sqlite3.node
  File ..\..\distrib\ScratchPortable\ScratchPortable.exe    
  
SectionEnd ; end the section

Section "Run as Service" ;No components page, name is not important

  ; Set output path to the installation directory.
  SetOutPath $INSTDIR
  ; Put file there
  File ..\..\distrib\ScratchPortable\ServiceInstall.bat     
  File ..\..\distrib\ScratchPortable\ServiceUninstall.bat  
  File ..\..\distrib\ScratchPortable\nssm.exe
  ExecWait '"$INSTDIR\nssm.exe" install "Scratch Portable" "$INSTDIR\ScratchPortable.exe" "$INSTDIR"'
SectionEnd ; end the section

