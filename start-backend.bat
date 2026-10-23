@echo off
title SmartSpend - Spring Boot Backend
echo Starting SmartSpend Backend on port 8080...
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run
pause
