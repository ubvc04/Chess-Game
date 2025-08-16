@echo off
echo Starting Chess Game Development Environment...
echo.

echo Starting Backend Server...
start "Chess Server" cmd /k "cd server && npm start"

echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Client...
start "Chess Client" cmd /k "cd client && npm start"

echo.
echo Both server and client are starting...
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul