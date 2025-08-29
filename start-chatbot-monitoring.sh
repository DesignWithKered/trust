#!/bin/bash

echo "🚀 Starting FlagWise with Chatbot Monitoring..."
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    echo "   - On Windows/Mac: Start Docker Desktop"
    echo "   - On Linux: Run 'sudo systemctl start docker'"
    exit 1
fi

# Check if Docker Compose is available
if ! docker-compose --version > /dev/null 2>&1; then
    echo "❌ Docker Compose is not available. Please install it first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"
echo ""

# Stop any existing containers
echo "🛑 Stopping any existing FlagWise containers..."
docker-compose down

# Start the services
echo "🚀 Starting FlagWise services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start up..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "🎉 FlagWise is starting up!"
echo ""
echo "📱 Frontend (React): http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 API Documentation: http://localhost:8000/docs"
echo ""
echo "⏳ Please wait 2-3 minutes for all services to fully start up."
echo ""
echo "🔑 Default login credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "📚 To view the new Chatbot Management features:"
echo "   1. Go to http://localhost:3000"
echo "   2. Login with admin/admin123"
echo "   3. Look for 'Chatbot Management' in the left sidebar"
echo "   4. Click on 'Chatbots' to add your first chatbot"
echo ""
echo "🛑 To stop FlagWise, run: docker-compose down"
echo "🔄 To restart, run: docker-compose restart"
echo ""
echo "📖 For more information, see CHATBOT_MONITORING.md"