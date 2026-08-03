@echo off
title JobPrep AI
cd /d "%~dp0"

echo.
echo  ================================
echo    JobPrep AI - מערכת מתחילה...
echo  ================================
echo.

:: סגור פתיחה קודמת אם קיימת
taskkill /f /fi "WINDOWTITLE eq JobPrep AI - Servers" /t >nul 2>&1

:: שחרר פורטים אם תפוסים
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5174 "') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5175 "') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8787 "') do taskkill /f /pid %%a >nul 2>&1

timeout /t 1 /nobreak >nul

echo  מפעיל שרתים...
start "JobPrep AI - Servers" cmd /k "node start-dev.js"

echo  ממתינה לטעינה (15 שניות)...
timeout /t 15 /nobreak >nul

start "" "http://localhost:5173"

echo  האתר נפתח בדפדפן.
timeout /t 2 /nobreak >nul
exit
