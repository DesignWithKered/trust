#!/bin/bash

echo "🚀 Starting FlagWise Shadow AI Detection Server..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the flagwise directory."
    exit 1
fi

echo "📦 Starting all services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 15

echo ""
echo "📊 Checking service status..."
docker-compose ps

echo ""
echo "🎉 FlagWise is ready!"
echo ""
echo "📋 Access Information:"
echo "   🌐 Web Dashboard: http://localhost:3000"
echo "   🔧 API Documentation: http://localhost:8000/docs"
echo "   📊 Health Check: http://localhost:8000/health"
echo ""
echo "🔑 Login Credentials:"
echo "   👤 Admin: admin / admin123"
echo "   👁️  Viewer: viewer / viewer123"
echo ""
echo "🔧 Useful Commands:"
echo "   📊 Check status: docker-compose ps"
echo "   📝 View logs: docker-compose logs -f"
echo "   🛑 Stop services: docker-compose down"
echo ""
echo "🎯 Next Steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Login with admin / admin123"
echo "3. Explore the dashboard and features!"
echo ""