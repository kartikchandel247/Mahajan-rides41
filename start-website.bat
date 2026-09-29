@echo off
title Mahajan Rides - Web Server
echo ====================================================
echo Starting Mahajan Rides Web Server...
echo The website will automatically open in Google Chrome.
echo ====================================================
echo.

cd /d "%~dp0"
npm run dev
pause
