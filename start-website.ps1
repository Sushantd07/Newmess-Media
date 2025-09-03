# Website Startup Script for Windows PowerShell
# This script will help you start the website without freezing issues

Write-Host "🚀 Starting Website..." -ForegroundColor Green
Write-Host ""

# Check if .env file exists in Backend folder
$envPath = "Backend\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "⚠️  No .env file found in Backend folder!" -ForegroundColor Yellow
    Write-Host "📝 Creating .env file..." -ForegroundColor Cyan
    
    $envContent = @"
# MongoDB Connection
MONGODB_URL=mongodb://localhost:27017

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend Origin (for CORS)
FRONTEND_ORIGIN=http://localhost:5174

# Site URL
SITE_URL=http://localhost:5174
"@
    
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "✅ .env file created successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Cyan
Write-Host "📁 Starting in Backend directory..." -ForegroundColor Gray

# Start backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; npm run dev"

Write-Host "⏳ Waiting 5 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎨 Starting Frontend..." -ForegroundColor Cyan
Write-Host "📁 Starting in Frontend directory..." -ForegroundColor Gray

# Start frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npm run dev"

Write-Host ""
Write-Host "🎉 Website startup initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor White
Write-Host "1. Wait for both servers to start completely" -ForegroundColor Gray
Write-Host "2. Backend should be running on http://localhost:3000" -ForegroundColor Gray
Write-Host "3. Frontend should be running on http://localhost:5174" -ForegroundColor Gray
Write-Host "4. Open http://localhost:5174 in your browser" -ForegroundColor Gray
Write-Host ""
Write-Host "🔍 If you see any errors, check the terminal windows that opened" -ForegroundColor Yellow
Write-Host "💡 The website should now load without freezing!" -ForegroundColor Green

# Keep the script running
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
