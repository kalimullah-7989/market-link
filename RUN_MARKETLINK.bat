@echo off
title MarketLink Full Stack Launcher
echo ========================================================
echo        MarketLink Full-Stack Launcher (Windows)
echo ========================================================
echo.
echo [1/2] Starting Laravel Backend API on http://127.0.0.1:8000 ...
start "MarketLink API (Port 8000)" cmd /k "cd backend && php artisan serve --port=8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Vite Frontend on http://localhost:3000 ...
start "MarketLink Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo  Both servers launched successfully!
echo  - Frontend: http://localhost:3000
echo  - API:      http://127.0.0.1:8000/api
echo ========================================================
echo.
pause
