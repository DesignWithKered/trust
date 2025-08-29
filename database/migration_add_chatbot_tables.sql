-- Migration: Add Chatbot Management Tables
-- This migration adds tables for managing and monitoring company chatbots

-- Chatbots table for storing chatbot configurations
CREATE TABLE IF NOT EXISTS chatbots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    company_name TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google', 'meta', 'custom', 'other')),
    model TEXT NOT NULL,
    endpoint_url TEXT,
    api_key_hash TEXT NOT NULL, -- Hashed API key for security
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'monitoring')),
    monitoring_enabled BOOLEAN DEFAULT TRUE,
    risk_threshold INTEGER DEFAULT 70 CHECK (risk_threshold >= 0 AND risk_threshold <= 100),
    alert_on_risk BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_monitored TIMESTAMPTZ,
    total_conversations INTEGER DEFAULT 0,
    flagged_conversations INTEGER DEFAULT 0
);

-- Chatbot conversations table for monitoring responses
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    conversation_id TEXT NOT NULL, -- External conversation ID from chatbot
    user_id TEXT, -- External user ID from chatbot
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    prompt TEXT NOT NULL, -- Will be encrypted
    response TEXT NOT NULL, -- Will be encrypted
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    metadata JSONB, -- Additional conversation metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chatbots_company_name ON chatbots (company_name);
CREATE INDEX IF NOT EXISTS idx_chatbots_provider ON chatbots (provider);
CREATE INDEX IF NOT EXISTS idx_chatbots_status ON chatbots (status);
CREATE INDEX IF NOT EXISTS idx_chatbots_monitoring_enabled ON chatbots (monitoring_enabled);
CREATE INDEX IF NOT EXISTS idx_chatbots_created_at ON chatbots (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_chatbot_id ON chatbot_conversations (chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_conversation_id ON chatbot_conversations (conversation_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_id ON chatbot_conversations (user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_timestamp ON chatbot_conversations (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_is_flagged ON chatbot_conversations (is_flagged) WHERE is_flagged = TRUE;
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_risk_score ON chatbot_conversations (risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_created_at ON chatbot_conversations (created_at DESC);

-- Add trigger for chatbots table
CREATE TRIGGER update_chatbots_updated_at BEFORE UPDATE ON chatbots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update alerts table to support chatbot alerts
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'llm_request' CHECK (source_type IN ('llm_request', 'chatbot', 'system'));
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS source_id UUID; -- Can reference chatbots or other sources
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS related_request_id UUID REFERENCES llm_requests(id); -- Renamed from request_id for clarity

-- Create index for new alert fields
CREATE INDEX IF NOT EXISTS idx_alerts_source_type ON alerts (source_type);
CREATE INDEX IF NOT EXISTS idx_alerts_source_id ON alerts (source_id);

-- Insert some sample chatbots for testing
INSERT INTO chatbots (name, description, company_name, provider, model, status, monitoring_enabled) VALUES
('Customer Support Bot', 'AI-powered customer support chatbot', 'Acme Corp', 'openai', 'gpt-4', 'active', true),
('Sales Assistant', 'Sales team AI assistant', 'TechStart Inc', 'anthropic', 'claude-3-sonnet', 'active', true),
('HR Helper', 'Human resources information bot', 'Global Enterprises', 'google', 'gemini-pro', 'active', true)
ON CONFLICT DO NOTHING;

-- Grant permissions to shadow_user
GRANT ALL PRIVILEGES ON TABLE chatbots TO shadow_user;
GRANT ALL PRIVILEGES ON TABLE chatbot_conversations TO shadow_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO shadow_user;