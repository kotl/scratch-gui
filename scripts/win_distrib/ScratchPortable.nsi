!include MUI2.nsh

Name "Scratch 3.0 Portable"

; The file to write
OutFile "..\..\distrib\ScratchPortableInstall.exe"

; The default installation directory
InstallDir "$APPDATA\Scratch Portable"

; Request application privileges for Windows Vista
RequestExecutionLevel user

;--------------------------------

; Pages

Page directory
Page instfiles

;--------------------------------

; The stuff to install
Section "" ;No components page, name is not important

  ; Set output path to the installation directory.
  SetOutPath $INSTDIR
  
  ; Put file there
  File ..\..\distrib\ScratchPortable\node_sqlite3.node
  File ..\..\distrib\ScratchPortable\ScratchPortable.exe    
  File www.ico
  File scratch.ico    
  CreateDirectory $INSTDIR\public
  CreateDirectory "$SMPROGRAMS\Scratch Portable"
  CreateShortcut "$SMPROGRAMS\Scratch Portable\Scratch Portable Server.lnk" "$INSTDIR\ScratchPortable.exe" \
  "" "$INSTDIR\scratch.ico" 0 SW_SHOWMAXIMIZED ALT|CONTROL|S "Scratch Portable Server"

  CreateShortcut "$DESKTOP\Scratch Portable Server.lnk" "$INSTDIR\ScratchPortable.exe" \
  "" "$INSTDIR\scratch.ico" 0 SW_SHOWMAXIMIZED ALT|CONTROL|S "Scratch Portable Server"

  CreateShortcut /NoWorkingDir "$SMPROGRAMS\Scratch Portable\Scratch Public Directory.lnk" "$INSTDIR\public" \
  "" "$INSTDIR\www.ico" 0 SW_SHOWNORMAL ALT|CONTROL|P "Scratch Public Directory"

  CreateShortcut /NoWorkingDir "$DESKTOP\Scratch Public Directory.lnk" "$INSTDIR\public" \
  "" "$INSTDIR\www.ico" 0 SW_SHOWNORMAL ALT|CONTROL|P "Scratch Public Directory"
  
SectionEnd ; end the section
