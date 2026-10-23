@echo off
title SmartSpend - Fullstack Starter
echo ========================================================
echo   Starting SmartSpend: Spring Boot + React + MySQL
echo ========================================================
echo Launching Spring Boot Backend...
start "SmartSpend Backend" cmd /k "%~dp0start-backend.bat"
timeout /t 5 /nobreak >nul
echo Launching React Frontend...
start "SmartSpend Frontend" cmd /k "%~dp0start-frontend.bat"
echo Done! Both servers are starting up.
echo Frontend URL: http://localhost:5173
echo Backend API : http://localhost:8080/api
pause
