@echo off
setlocal EnableDelayedExpansion

set "TARGET_MAJOR=3"
set "TARGET_MINOR=12"

echo Checking for Python %TARGET_MAJOR%.%TARGET_MINOR%...
echo -------------------------------------------

:: Try to get python 3.12 version using py launcher
py -3.12 --version > temp_ver.txt 2>&1

if %errorlevel% neq 0 (
    echo ❌ Error: Python %TARGET_MAJOR%.%TARGET_MINOR% not found.
    echo Hint: Install Python 3.12 or check your installation.
    goto end
)

set /p VERSION_LINE=<temp_ver.txt
del temp_ver.txt

echo Detected: %VERSION_LINE%

echo %VERSION_LINE% | findstr "%TARGET_MAJOR%.%TARGET_MINOR%" >nul
if %errorlevel% equ 0 (
    echo ✅ Success: Python %TARGET_MAJOR%.%TARGET_MINOR% is available!
) else (
    echo ❌ Warning: Python found, but it is NOT version %TARGET_MAJOR%.%TARGET_MINOR%.
)

:end
echo -------------------------------------------
pause