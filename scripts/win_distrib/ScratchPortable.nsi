!include MUI2.nsh

Name "Scratch Portable 3.0 Beta"
; The file to write
OutFile "..\..\distrib\ScratchPortableInstall.exe"
; The default installation directory
InstallDir "$APPDATA\Scratch Portable"

; Request application privileges for Windows Vista
RequestExecutionLevel user

!define MUI_ICON "scratch.ico"

!define MUI_WELCOMEFINISHPAGE_BITMAP "box.bmp"

!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "header.bmp"
!define MUI_HEADERIMAGE_LEFT

!define MUI_FINISHPAGE_RUN "$INSTDIR\ScratchPortable.exe"

!define MUI_WELCOMEPAGE_TITLE "Welcome to Scratch Portable installer!"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through a simple install process and you will be able to run Scratch Portable on your local network moments after installation from 'Scratch Portable' Start menu folder. $\r$\n$\r$\nWhen you start it, make sure to allow private and public networks to access it. Also note: this is not a service application, so you are always in control when you start and stop it from being accessible from local area network or internet."

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\..\LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

; The stuff to install
Section "Dummy Section" SecDummy

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

  SetOutPath $INSTDIR\public
  File INFO.txt
  
SectionEnd ; end the section

