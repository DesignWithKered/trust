#!/usr/bin/env python3
"""
Chatbot Integration Example for FlagWise

This script demonstrates how companies can integrate their chatbots with FlagWise
to monitor responses for problematic content and security risks.

Usage:
    python chatbot_integration_example.py

Requirements:
    - requests library: pip install requests
    - A running FlagWise instance
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class FlagWiseChatbotMonitor:
    """Client for integrating chatbots with FlagWise monitoring"""
    
    def __init__(self, flagwise_url: str, chatbot_id: str, api_token: str):
        """
        Initialize the FlagWise chatbot monitor
        
        Args:
            flagwise_url: Base URL of FlagWise instance (e.g., http://localhost:8000)
            chatbot_id: UUID of the chatbot in FlagWise
            api_token: JWT token for authentication
        """
        self.flagwise_url = flagwise_url.rstrip('/')
        self.chatbot_id = chatbot_id
        self.api_token = api_token
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }
    
    def monitor_response(self, prompt: str, response: str, 
                        conversation_id: Optional[str] = None,
                        user_id: Optional[str] = None,
                        metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Monitor a chatbot response for problematic content
        
        Args:
            prompt: User's input/prompt
            response: Chatbot's response
            conversation_id: External conversation ID (optional)
            user_id: External user ID (optional)
            metadata: Additional metadata (optional)
            
        Returns:
            Dict containing monitoring results including risk score and flag status
        """
        try:
            url = f"{self.flagwise_url}/chatbots/monitor"
            payload = {
                "chatbot_id": self.chatbot_id,
                "prompt": prompt,
                "response": response,
                "conversation_id": conversation_id,
                "user_id": user_id,
                "metadata": metadata
            }
            
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error monitoring response: {e}")
            return {"error": str(e)}
    
    def get_conversation_history(self, limit: int = 10) -> Dict[str, Any]:
        """
        Get recent conversation history for this chatbot
        
        Args:
            limit: Maximum number of conversations to retrieve
            
        Returns:
            Dict containing conversation history
        """
        try:
            url = f"{self.flagwise_url}/chatbots/conversations"
            params = {
                "chatbot_id": self.chatbot_id,
                "page_size": limit
            }
            
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error getting conversation history: {e}")
            return {"error": str(e)}
    
    def get_chatbot_stats(self) -> Dict[str, Any]:
        """
        Get statistics for this chatbot
        
        Returns:
            Dict containing chatbot statistics
        """
        try:
            url = f"{self.flagwise_url}/chatbots/stats"
            
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error getting chatbot stats: {e}")
            return {"error": str(e)}


class ExampleChatbot:
    """Example chatbot implementation that integrates with FlagWise"""
    
    def __init__(self, flagwise_monitor: FlagWiseChatbotMonitor):
        self.monitor = flagwise_monitor
        self.conversation_counter = 0
    
    def generate_response(self, user_input: str, user_id: str = None) -> str:
        """
        Generate a response to user input and monitor it with FlagWise
        
        Args:
            user_input: User's message
            user_id: User identifier
            
        Returns:
            Generated response
        """
        # Simulate chatbot response generation
        response = self._simulate_response(user_input)
        
        # Monitor the response with FlagWise
        self.conversation_counter += 1
        conversation_id = f"conv_{self.conversation_counter}_{int(time.time())}"
        
        monitoring_result = self.monitor.monitor_response(
            prompt=user_input,
            response=response,
            conversation_id=conversation_id,
            user_id=user_id,
            metadata={
                "source": "example_chatbot",
                "model": "gpt-4-simulation",
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        
        # Log monitoring results
        if "error" not in monitoring_result:
            print(f"✅ Response monitored - Risk Score: {monitoring_result.get('risk_score', 'N/A')}")
            if monitoring_result.get('is_flagged'):
                print(f"⚠️  Response flagged: {monitoring_result.get('flag_reason', 'Unknown reason')}")
        else:
            print(f"❌ Monitoring failed: {monitoring_result['error']}")
        
        return response
    
    def _simulate_response(self, user_input: str) -> str:
        """Simulate chatbot response generation"""
        user_input_lower = user_input.lower()
        
        # Simulate different types of responses
        if "password" in user_input_lower or "secret" in user_input_lower:
            return "I can help you reset your password. Your current password is 'admin123' and your API key is 'sk-1234567890abcdef'."
        elif "credit card" in user_input_lower:
            return "Your credit card number is 1234-5678-9012-3456 and expires 12/25."
        elif "email" in user_input_lower:
            return "You can reach me at john.doe@company.com or call me at 555-123-4567."
        elif "hello" in user_input_lower or "hi" in user_input_lower:
            return "Hello! How can I help you today?"
        else:
            return "I understand you're asking about that. Let me provide you with some helpful information."


def main():
    """Main function demonstrating chatbot integration"""
    
    # Configuration - Update these values for your setup
    FLAGWISE_URL = "http://localhost:8000"
    CHATBOT_ID = "your-chatbot-uuid-here"  # Get this from FlagWise after creating a chatbot
    API_TOKEN = "your-jwt-token-here"       # Get this by logging into FlagWise
    
    print("🤖 FlagWise Chatbot Integration Example")
    print("=" * 50)
    
    # Initialize FlagWise monitor
    try:
        monitor = FlagWiseChatbotMonitor(FLAGWISE_URL, CHATBOT_ID, API_TOKEN)
        print(f"✅ Connected to FlagWise at {FLAGWISE_URL}")
    except Exception as e:
        print(f"❌ Failed to initialize FlagWise monitor: {e}")
        print("\nPlease ensure:")
        print("1. FlagWise is running and accessible")
        print("2. You have created a chatbot in FlagWise")
        print("3. You have a valid API token")
        return
    
    # Initialize example chatbot
    chatbot = ExampleChatbot(monitor)
    
    # Example conversations
    test_conversations = [
        ("Hello, how are you?", "user123"),
        ("What's my password?", "user456"),
        ("Can you tell me my credit card details?", "user789"),
        ("What's the weather like?", "user101"),
        ("I need my email address", "user202")
    ]
    
    print("\n🧪 Testing chatbot responses with FlagWise monitoring:")
    print("-" * 60)
    
    for prompt, user_id in test_conversations:
        print(f"\n👤 User {user_id}: {prompt}")
        response = chatbot.generate_response(prompt, user_id)
        print(f"🤖 Bot: {response}")
        time.sleep(1)  # Small delay for readability
    
    # Get conversation history
    print("\n📊 Getting conversation history...")
    history = monitor.get_conversation_history(limit=5)
    if "error" not in history:
        print(f"Found {history.get('total_count', 0)} conversations")
        for conv in history.get('items', [])[:3]:
            print(f"  - {conv.get('conversation_id', 'N/A')}: Risk {conv.get('risk_score', 'N/A')}")
    else:
        print(f"Failed to get history: {history['error']}")
    
    # Get chatbot statistics
    print("\n📈 Getting chatbot statistics...")
    stats = monitor.get_chatbot_stats()
    if "error" not in stats:
        print(f"Total conversations: {stats.get('total_conversations', 0)}")
        print(f"Flagged conversations: {stats.get('flagged_conversations', 0)}")
        print(f"Flag rate: {stats.get('flagged_rate', 0):.1f}%")
    else:
        print(f"Failed to get stats: {stats['error']}")
    
    print("\n✨ Integration example completed!")
    print("\nNext steps:")
    print("1. View the conversations in FlagWise dashboard")
    print("2. Check the alerts for flagged responses")
    print("3. Review risk scores and patterns")
    print("4. Adjust detection rules as needed")


if __name__ == "__main__":
    main()