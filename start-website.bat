@echo off
echo 🚀 Starting Website...
echo.

REM Check if .env file exists in Backend folder
if not exist "Backend\.env" (
    echo ⚠️  No .env file found in Backend folder!
    echo 📝 Creating .env file...
    
    (
        echo # MongoDB Connection
        echo MONGODB_URL=mongodb://localhost:27017
        echo.
        echo # Server Configuration
        echo PORT=3000
        echo NODE_ENV=development
        echo.
        echo # Frontend Origin (for CORS)
        echo FRONTEND_ORIGIN=http://localhost:5174
        echo.
        echo # Site URL
        echo SITE_URL=http://localhost:5174
    ) > "Backend\.env"
    
    echo ✅ .env file created successfully!
) else (
    echo ✅ .env file already exists
)

echo.
echo 🔧 Starting Backend Server...
echo 📁 Starting in Backend directory...

REM Start backend server in new window
start "Backend Server" cmd /k "cd /d Backend && npm run dev"

echo ⏳ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🎨 Starting Frontend...
echo 📁 Starting in Frontend directory...

REM Start frontend server in new window
start "Frontend Server" cmd /k "cd /d Frontend && npm run dev"

echo.
echo 🎉 Website startup initiated!
echo.
echo 📋 Next steps:
echo 1. Wait for both servers to start completely
echo 2. Backend should be running on http://localhost:3000
echo 3. Frontend should be running on http://localhost:5174
echo 4. Open http://localhost:5174 in your browser
echo.
echo 🔍 If you see any errors, check the terminal windows that opened
echo 💡 The website should now load without freezing!
echo.
pause
