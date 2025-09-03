@echo off
echo 🚀 Starting SSR Server...
echo 📊 This will fetch SEO data server-side for crawlers
echo.

REM Build the app first
echo 🔨 Building the app...
call npm run build

REM Start the SSR server
echo 🚀 Starting SSR server on port 3000...
node server.js

pause
