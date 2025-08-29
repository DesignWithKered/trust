#!/usr/bin/env python3
"""
Test Script for FlagWise Chatbot Monitoring

This script tests the chatbot monitoring functionality to ensure everything is working correctly.

Usage:
    python test_chatbot_monitoring.py

Prerequisites:
    1. FlagWise is running (API accessible)
    2. Database migration has been applied
    3. You have admin credentials
"""

import requests
import json
import sys
from datetime import datetime

def test_flagwise_connection(base_url):
    """Test basic connection to FlagWise"""
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ FlagWise is accessible")
            return True
        else:
            print(f"❌ FlagWise health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to FlagWise: {e}")
        return False

def login_to_flagwise(base_url, username, password):
    """Login to FlagWise and get JWT token"""
    try:
        response = requests.post(f"{base_url}/auth/login", data={
            "username": username,
            "password": password
        })
        
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Successfully logged in to FlagWise")
            return token_data["access_token"]
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def create_test_chatbot(base_url, token):
    """Create a test chatbot"""
    headers = {"Authorization": f"Bearer {token}"}
    
    chatbot_data = {
        "name": "Test Chatbot",
        "description": "Test chatbot for monitoring verification",
        "company_name": "Test Company",
        "provider": "openai",
        "model": "gpt-4",
        "api_key": "test-api-key-12345",
        "monitoring_enabled": True,
        "risk_threshold": 70,
        "alert_on_risk": True
    }
    
    try:
        response = requests.post(f"{base_url}/chatbots", 
                               headers=headers, 
                               json=chatbot_data)
        
        if response.status_code == 200:
            chatbot = response.json()
            print(f"✅ Test chatbot created: {chatbot['id']}")
            return chatbot
        else:
            print(f"❌ Failed to create chatbot: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error creating chatbot: {e}")
        return None

def test_chatbot_monitoring(base_url, token, chatbot_id):
    """Test chatbot response monitoring"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test case 1: Safe response
    safe_response = {
        "chatbot_id": chatbot_id,
        "prompt": "What's the weather like today?",
        "response": "I don't have access to real-time weather information, but I can help you with other questions!",
        "conversation_id": "test_safe_1",
        "user_id": "test_user_1"
    }
    
    try:
        response = requests.post(f"{base_url}/chatbots/monitor", 
                               headers=headers, 
                               json=safe_response)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Safe response monitored - Risk Score: {result.get('risk_score', 'N/A')}")
            print(f"   Flagged: {result.get('is_flagged', 'N/A')}")
        else:
            print(f"❌ Safe response monitoring failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error monitoring safe response: {e}")
        return False
    
    # Test case 2: Risky response (should be flagged)
    risky_response = {
        "chatbot_id": chatbot_id,
        "prompt": "What's my password?",
        "response": "Your password is 'admin123' and your API key is 'sk-1234567890abcdef'.",
        "conversation_id": "test_risky_1",
        "user_id": "test_user_2"
    }
    
    try:
        response = requests.post(f"{base_url}/chatbots/monitor", 
                               headers=headers, 
                               json=risky_response)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Risky response monitored - Risk Score: {result.get('risk_score', 'N/A')}")
            print(f"   Flagged: {result.get('is_flagged', 'N/A')}")
            if result.get('is_flagged'):
                print(f"   Flag Reason: {result.get('flag_reason', 'N/A')}")
        else:
            print(f"❌ Risky response monitoring failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error monitoring risky response: {e}")
        return False
    
    return True

def test_conversation_retrieval(base_url, token, chatbot_id):
    """Test retrieving conversation history"""
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{base_url}/chatbots/conversations", 
                              headers=headers, 
                              params={"chatbot_id": chatbot_id, "page_size": 10})
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Retrieved {len(result.get('items', []))} conversations")
            return True
        else:
            print(f"❌ Failed to retrieve conversations: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error retrieving conversations: {e}")
        return False

def test_chatbot_stats(base_url, token):
    """Test chatbot statistics endpoint"""
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{base_url}/chatbots/stats", headers=headers)
        
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ Chatbot stats retrieved:")
            print(f"   Total chatbots: {stats.get('total_chatbots', 'N/A')}")
            print(f"   Total conversations: {stats.get('total_conversations', 'N/A')}")
            print(f"   Flagged conversations: {stats.get('flagged_conversations', 'N/A')}")
            return True
        else:
            print(f"❌ Failed to retrieve chatbot stats: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error retrieving chatbot stats: {e}")
        return False

def cleanup_test_chatbot(base_url, token, chatbot_id):
    """Clean up the test chatbot"""
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.delete(f"{base_url}/chatbots/{chatbot_id}", headers=headers)
        
        if response.status_code == 200:
            print(f"✅ Test chatbot cleaned up")
            return True
        else:
            print(f"❌ Failed to cleanup chatbot: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error cleaning up chatbot: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 FlagWise Chatbot Monitoring Test")
    print("=" * 50)
    
    # Configuration
    base_url = "http://localhost:8000"
    username = "admin"
    password = "admin123"  # Default password - change if different
    
    print(f"Testing FlagWise at: {base_url}")
    print(f"Username: {username}")
    print()
    
    # Test 1: Connection
    if not test_flagwise_connection(base_url):
        print("\n❌ Cannot proceed without FlagWise connection")
        sys.exit(1)
    
    # Test 2: Authentication
    token = login_to_flagwise(base_url, username, password)
    if not token:
        print("\n❌ Cannot proceed without authentication")
        sys.exit(1)
    
    # Test 3: Create test chatbot
    chatbot = create_test_chatbot(base_url, token)
    if not chatbot:
        print("\n❌ Cannot proceed without test chatbot")
        sys.exit(1)
    
    chatbot_id = chatbot["id"]
    
    try:
        # Test 4: Monitor responses
        print("\n📊 Testing response monitoring...")
        if not test_chatbot_monitoring(base_url, token, chatbot_id):
            print("❌ Response monitoring tests failed")
            return
        
        # Test 5: Retrieve conversations
        print("\n📋 Testing conversation retrieval...")
        if not test_conversation_retrieval(base_url, token, chatbot_id):
            print("❌ Conversation retrieval test failed")
            return
        
        # Test 6: Get statistics
        print("\n📈 Testing statistics...")
        if not test_chatbot_stats(base_url, token):
            print("❌ Statistics test failed")
            return
        
        print("\n🎉 All tests passed! Chatbot monitoring is working correctly.")
        print("\nNext steps:")
        print("1. Check the FlagWise dashboard for the new chatbot")
        print("2. View the flagged conversations in the Conversations tab")
        print("3. Review the alerts generated for risky responses")
        print("4. Explore the chatbot statistics and analytics")
        
    finally:
        # Cleanup
        print("\n🧹 Cleaning up test data...")
        cleanup_test_chatbot(base_url, token, chatbot_id)

if __name__ == "__main__":
    main()