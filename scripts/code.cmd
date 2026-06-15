@ECHO off
SETLOCAL ENABLEDELAYEDEXPANSION

REM DoneSignal wrapper for CommandCode
REM Usage: code [args...]
REM Runs donesignal --agent commandcode -- commandcode [args...]

SET "DONESIGNAL_AGENT=commandcode"

REM Find the donesignal command
WHERE donesignal >nul 2>nul
IF ERRORLEVEL 1 (
    ECHO Error: donesignal not found. Install it with: npm install -g donesignal
    EXIT /b 1
)

REM Find the commandcode command
WHERE commandcode >nul 2>nul
IF ERRORLEVEL 1 (
    ECHO Error: commandcode not found.
    EXIT /b 1
)

REM Run DoneSignal wrapping CommandCode
donesignal --agent commandcode -- commandcode %*
EXIT /b !ERRORLEVEL!
