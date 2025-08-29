@echo off
echo 🚀 Starting FlagWise with Chatbot Monitoring...
echo ================================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    echo    - Start Docker Desktop from your Start Menu
    echo    - Wait for it to fully start up
    echo    - Then run this script again
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available. Please install it first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are available
echo.

REM Stop any existing containers
echo 🛑 Stopping any existing FlagWise containers...
docker-compose down

REM Start the services
echo 🚀 Starting FlagWise services...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start up...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

echo.
echo 🎉 FlagWise is starting up!
echo.
echo 📱 Frontend (React): http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📊 API Documentation: http://localhost:8000/docs
echo.
echo ⏳ Please wait 2-3 minutes for all services to fully start up.
echo.
echo 🔑 Default login credentials:
echo    Username: admin
echo    Password: admin123
echo.
echo 📚 To view the new Chatbot Management features:
echo    1. Go to http://localhost:3000
echo    2. Login with admin/admin123
echo    3. Look for 'Chatbot Management' in the left sidebar
echo    4. Click on 'Chatbots' to add your first chatbot
echo.
echo 🛑 To stop FlagWise, run: docker-compose down
echo 🔄 To restart, run: docker-compose restart
echo.
echo 📖 For more information, see CHATBOT_MONITORING.md
echo.
pause