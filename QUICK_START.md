# FlagWise Quick Start Guide

## 🚀 Getting Started (2 minutes)

### Step 1: Start the Services
Run this command in your terminal:
```bash
./start-flagwise.sh
```

Or manually with Docker Compose:
```bash
docker-compose up -d
```

### Step 2: Access the Dashboard
Open your web browser and go to:
**http://localhost:3000**

### Step 3: Login
Use these credentials:
- **Admin Access**: `admin` / `admin123`
- **Read-only Access**: `viewer` / `viewer123`

## 🎯 What You'll See

### Dashboard Overview
- **Total Requests**: Number of LLM API calls processed
- **Flagged Requests**: Security threats detected
- **Risk Metrics**: Average risk scores and threat analysis
- **Recent Activity**: Latest LLM requests and security events

### Key Features to Explore
1. **LLM Requests** - View all intercepted API calls
2. **Flagged Prompts** - Security threats and policy violations
3. **Live Feed** - Real-time stream of activity
4. **Detection Rules** - Configure security patterns (Admin only)
5. **Alerts** - Security notifications and alerts
6. **User Management** - Manage user accounts (Admin only)

## 🔧 Troubleshooting

### Services Won't Start
```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Restart services
docker-compose down
docker-compose up -d
```

### Can't Access Dashboard
1. Verify services are running: `docker-compose ps`
2. Check logs: `docker-compose logs web`
3. Try: http://127.0.0.1:3000 instead

### Database Issues
```bash
# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

## 📊 Demo Data

The system includes a data generator that creates realistic LLM traffic:
- **Volume**: 2-3 requests per second
- **Providers**: OpenAI, Anthropic, Google, Cohere, etc.
- **Risk Scenarios**: Data exposure, prompt injection, unauthorized models
- **Business Patterns**: 5 user personas with realistic activity

## 🎮 Interactive Features

### Trigger Security Incidents
```bash
make trigger-incidents
```

### View System Status
```bash
make status
python3 verify_system.py
```

### Stop Everything
```bash
docker-compose down
```

---

**🎉 You're all set! The dashboard should now be accessible at http://localhost:3000**

Login with `admin` / `admin123` and start exploring your LLM security monitoring system!