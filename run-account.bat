@echo off
cd /d "%~dp0\bank-microservices-react\backend"
call mvnw.cmd spring-boot:run -pl account-service
pause

