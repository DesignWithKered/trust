# Chatbot Monitoring Feature

FlagWise now includes comprehensive chatbot monitoring capabilities that allow companies to add their chatbots to the system and monitor them for problematic responses in real-time.

## Overview

The chatbot monitoring feature enables organizations to:
- Register their chatbots with FlagWise
- Monitor all chatbot conversations for security risks
- Detect problematic responses using existing detection rules
- Generate alerts for flagged conversations
- Track chatbot performance and risk metrics
- Maintain conversation history for compliance and auditing

## Features

### 🚀 Chatbot Management
- **Easy Registration**: Add chatbots with company information, provider details, and API credentials
- **Flexible Configuration**: Set risk thresholds, enable/disable monitoring, and configure alerts
- **Multi-Provider Support**: Works with OpenAI, Anthropic, Google, Meta, and custom chatbot providers
- **Secure Storage**: API keys are hashed and stored securely

### 🔍 Real-Time Monitoring
- **Automatic Risk Scoring**: Every conversation is automatically analyzed using FlagWise's detection rules
- **Instant Flagging**: Responses that exceed risk thresholds are immediately flagged
- **Smart Alerts**: Configurable alerts for different risk levels and scenarios
- **Metadata Support**: Store additional context about conversations and users

### 📊 Analytics & Reporting
- **Risk Distribution**: View risk score distribution across all conversations
- **Performance Metrics**: Track flagged conversation rates and trends
- **Company Insights**: Compare risk levels across different chatbots and companies
- **Historical Data**: Maintain conversation history for compliance and analysis

## Getting Started

### 1. Database Setup

First, run the database migration to create the required tables:

```bash
# Connect to your PostgreSQL database
psql -U your_user -d your_database

# Run the migration
\i database/migration_add_chatbot_tables.sql
```

### 2. Create a Chatbot

Use the FlagWise web interface or API to create a new chatbot:

```bash
curl -X POST "http://localhost:8000/chatbots" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Support Bot",
    "description": "AI-powered customer support chatbot",
    "company_name": "Acme Corp",
    "provider": "openai",
    "model": "gpt-4",
    "api_key": "your-api-key-here",
    "monitoring_enabled": true,
    "risk_threshold": 70,
    "alert_on_risk": true
  }'
```

### 3. Integrate with Your Chatbot

Use the provided Python client to integrate FlagWise monitoring into your chatbot:

```python
from chatbot_integration_example import FlagWiseChatbotMonitor

# Initialize the monitor
monitor = FlagWiseChatbotMonitor(
    flagwise_url="http://localhost:8000",
    chatbot_id="your-chatbot-uuid",
    api_token="your-jwt-token"
)

# Monitor a response
result = monitor.monitor_response(
    prompt="User's question here",
    response="Chatbot's response here",
    conversation_id="conv_123",
    user_id="user_456"
)

print(f"Risk Score: {result['risk_score']}")
print(f"Flagged: {result['is_flagged']}")
```

## API Endpoints

### Chatbot Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chatbots` | POST | Create a new chatbot |
| `/chatbots` | GET | List all chatbots with filters |
| `/chatbots/{id}` | GET | Get chatbot details |
| `/chatbots/{id}` | PUT | Update chatbot |
| `/chatbots/{id}` | DELETE | Delete chatbot |
| `/chatbots/bulk-operation` | POST | Bulk operations on chatbots |
| `/chatbots/{id}/health` | GET | Check chatbot health |
| `/chatbots/stats` | GET | Get chatbot statistics |

### Conversation Monitoring

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chatbots/conversations` | POST | Create conversation record |
| `/chatbots/conversations` | GET | List conversations with filters |
| `/chatbots/conversations/{id}` | GET | Get conversation details |
| `/chatbots/monitor` | POST | Monitor a response in real-time |

## Configuration Options

### Risk Thresholds
- **Low Risk**: 0-24 (Minimal concern)
- **Medium Risk**: 25-49 (Moderate concern)
- **High Risk**: 50-74 (Significant concern)
- **Critical Risk**: 75-100 (Immediate action required)

### Monitoring Settings
- **Enable/Disable Monitoring**: Turn monitoring on/off per chatbot
- **Alert Configuration**: Choose when to generate alerts
- **Custom Rules**: Leverage existing FlagWise detection rules
- **Metadata Storage**: Store additional context about conversations

## Detection Rules

Chatbot monitoring uses the same detection rules as network traffic monitoring:

- **Keyword Detection**: Identify sensitive terms and phrases
- **Regex Patterns**: Match complex patterns (credit cards, emails, etc.)
- **Model Restrictions**: Control which AI models can be used
- **Custom Scoring**: Implement organization-specific risk calculations

## Alert System

When a chatbot response is flagged:

1. **Immediate Flagging**: Response is marked as flagged in real-time
2. **Risk Assessment**: Risk score is calculated and stored
3. **Alert Generation**: Alerts are created if enabled
4. **Dashboard Updates**: FlagWise dashboard shows flagged conversations
5. **Notification Options**: Email, Slack, or custom webhook notifications

## Security Features

- **API Key Hashing**: All API keys are securely hashed using bcrypt
- **JWT Authentication**: Secure API access with JWT tokens
- **Role-Based Access**: Admin-only access to chatbot management
- **Audit Logging**: All operations are logged for compliance
- **Data Encryption**: Sensitive data can be encrypted at rest

## Best Practices

### 1. Risk Threshold Configuration
- Start with a conservative threshold (e.g., 70)
- Monitor false positives and adjust accordingly
- Consider different thresholds for different chatbot types

### 2. Detection Rule Tuning
- Review flagged conversations regularly
- Add custom rules for organization-specific concerns
- Test rules with sample data before production use

### 3. Integration Patterns
- Monitor responses immediately after generation
- Include conversation context in metadata
- Implement retry logic for API failures

### 4. Compliance Considerations
- Maintain conversation logs for required retention periods
- Implement data anonymization if needed
- Regular review of flagged content for policy compliance

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify FlagWise is running and accessible
   - Check JWT token validity and expiration
   - Ensure proper network connectivity

2. **High False Positive Rates**
   - Review and adjust detection rules
   - Lower risk thresholds temporarily
   - Add custom rules for common patterns

3. **Performance Issues**
   - Monitor API response times
   - Consider batch processing for high-volume chatbots
   - Implement caching for repeated patterns

### Debug Mode

Enable debug logging in FlagWise to troubleshoot issues:

```bash
# Set log level in FlagWise configuration
LOG_LEVEL=DEBUG
```

## Examples

### Python Integration

```python
import requests

class ChatbotWithMonitoring:
    def __init__(self, flagwise_url, chatbot_id, api_token):
        self.flagwise_url = flagwise_url
        self.chatbot_id = chatbot_id
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }
    
    def respond_and_monitor(self, user_input, user_id=None):
        # Generate response (your chatbot logic here)
        response = self.generate_response(user_input)
        
        # Monitor with FlagWise
        monitoring_result = requests.post(
            f"{self.flagwise_url}/chatbots/monitor",
            headers=self.headers,
            json={
                "chatbot_id": self.chatbot_id,
                "prompt": user_input,
                "response": response,
                "user_id": user_id
            }
        ).json()
        
        # Handle flagged responses
        if monitoring_result.get('is_flagged'):
            print(f"⚠️ Response flagged: {monitoring_result['flag_reason']}")
            # Implement your escalation logic here
        
        return response
```

### JavaScript/Node.js Integration

```javascript
class FlagWiseMonitor {
    constructor(flagwiseUrl, chatbotId, apiToken) {
        this.flagwiseUrl = flagwiseUrl;
        this.chatbotId = chatbotId;
        this.headers = {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        };
    }
    
    async monitorResponse(prompt, response, userId = null) {
        try {
            const result = await fetch(`${this.flagwiseUrl}/chatbots/monitor`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    chatbot_id: this.chatbotId,
                    prompt,
                    response,
                    user_id: userId
                })
            });
            
            return await result.json();
        } catch (error) {
            console.error('Monitoring failed:', error);
            return { error: error.message };
        }
    }
}
```

## Support

For questions or issues with chatbot monitoring:

1. **Documentation**: Check this guide and the main FlagWise documentation
2. **GitHub Issues**: Report bugs or request features
3. **Community**: Join discussions in GitHub Discussions
4. **Examples**: Review the provided integration examples

## Future Enhancements

Planned improvements for chatbot monitoring:

- **Real-time Streaming**: WebSocket support for live monitoring
- **Advanced Analytics**: Machine learning-based risk assessment
- **Multi-language Support**: Detection rules for multiple languages
- **Integration SDKs**: Official SDKs for popular platforms
- **Custom Models**: Support for custom risk assessment models
- **Compliance Templates**: Pre-built rules for common compliance frameworks

---

*This feature is part of FlagWise's comprehensive AI security monitoring platform. For more information, visit the main FlagWise documentation.*