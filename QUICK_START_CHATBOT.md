# 🚀 Quick Start: Chatbot Monitoring on localhost:3000

This guide will get you up and running with FlagWise's new chatbot monitoring feature in just a few clicks!

## ✨ What You'll Get

- **FlagWise running on localhost:3000** with a beautiful web interface
- **Chatbot Management** - Add and configure your chatbots
- **Real-time monitoring** - Watch for problematic responses
- **Security alerts** - Get notified of risky chatbot behavior
- **Analytics dashboard** - View risk trends and statistics

## 🎯 Prerequisites

You only need **Docker Desktop** installed on your computer:

- **Windows/Mac**: Download from [docker.com](https://www.docker.com/products/docker-desktop/)
- **Linux**: Install Docker and Docker Compose

## 🚀 Getting Started (3 Simple Steps)

### Step 1: Start Docker Desktop
1. Open Docker Desktop from your Start Menu (Windows) or Applications (Mac)
2. Wait for it to fully start (you'll see the green "Docker Desktop is running" message)
3. Keep Docker Desktop running

### Step 2: Run the Start Script

**On Windows:**
- Double-click `start-chatbot-monitoring.bat`
- Or right-click and "Run as administrator"

**On Mac/Linux:**
- Open Terminal
- Navigate to the FlagWise folder
- Run: `./start-chatbot-monitoring.sh`

### Step 3: Open Your Browser
1. Wait 2-3 minutes for everything to start up
2. Open your browser and go to: **http://localhost:3000**
3. Login with:
   - Username: `admin`
   - Password: `admin123`

## 🎉 You're Done!

Once you're logged in, you'll see the new **Chatbot Management** section in the left sidebar:

- **Chatbots** - Add and manage your chatbots
- **Conversations** - Monitor chatbot responses and view flagged content

## 📱 What You'll See

### Main Dashboard
- Overview of all your chatbots
- Risk scores and flagged conversations
- Performance metrics

### Chatbot Management
- Add new chatbots with company info
- Configure monitoring settings
- Set risk thresholds
- Enable/disable monitoring

### Conversation Monitoring
- Real-time response monitoring
- Risk scoring and flagging
- Conversation history
- Detailed analysis of flagged responses

## 🔧 Adding Your First Chatbot

1. Click **Chatbots** in the left sidebar
2. Click **Add Chatbot** button
3. Fill in the details:
   - **Name**: "My Customer Support Bot"
   - **Company**: "Your Company Name"
   - **Provider**: Choose from dropdown (OpenAI, Google, etc.)
   - **Model**: "gpt-4" (or your model)
   - **API Key**: Your chatbot's API key
4. Click **Create**

## 🧪 Testing the Monitoring

1. Go to **Chatbot Conversations**
2. You'll see sample conversations already loaded
3. Look for flagged responses (they'll have red indicators)
4. Click **View** on any conversation to see details

## 🛠️ Troubleshooting

### "Docker is not running"
- Make sure Docker Desktop is started
- Wait for it to fully initialize (green status)

### "Port already in use"
- The script will automatically stop any existing containers
- If you get this error, close other applications using ports 3000 or 8000

### "Services not starting"
- Wait a bit longer (sometimes takes 3-4 minutes)
- Check Docker Desktop has enough resources (4GB RAM recommended)

### "Can't access localhost:3000"
- Make sure all services are running: `docker-compose ps`
- Try refreshing the page after waiting a few minutes

## 📚 Next Steps

Once you're comfortable with the interface:

1. **Add your real chatbots** with actual API keys
2. **Customize detection rules** in the Detection Rules section
3. **Set up alerts** for when responses are flagged
4. **Review flagged conversations** regularly
5. **Adjust risk thresholds** based on your needs

## 🆘 Need Help?

- **Check the logs**: `docker-compose logs web` or `docker-compose logs api`
- **Restart services**: `docker-compose restart`
- **Full reset**: `docker-compose down && docker-compose up -d`
- **View documentation**: See `CHATBOT_MONITORING.md` for detailed info

## 🎯 What's Happening Behind the Scenes

The script automatically:
- ✅ Starts PostgreSQL database with chatbot tables
- ✅ Launches the FastAPI backend on port 8000
- ✅ Starts the React frontend on port 3000
- ✅ Sets up all necessary database connections
- ✅ Loads sample data for testing

You don't need to run any commands or understand databases - it's all handled automatically!

---

**🎉 Congratulations! You now have a professional AI security monitoring platform running on your computer!**